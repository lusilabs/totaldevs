const functions = require('firebase-functions')
const admin = require('firebase-admin')
const fetch = require('node-fetch')
const crypto = require('crypto')
const fs = require('fs').promises

admin.initializeApp()
const logger = functions.logger
const config = functions.config()
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG)
const isDevelopment = process.env.FUNCTIONS_EMULATOR
const NUM_DEFAULT_INVITES = 3

exports.stripe = require('./stripe')

const isAuthed = ctx => {
  if (!ctx.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.')
  }
}

const isAppChecked = ctx => {
  if (!isDevelopment && !ctx.app) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called from an App Check verified app.')
  }
}

const isAuthedAndAppChecked = ctx => {
  isAuthed(ctx)
  isAppChecked(ctx)
  return ctx.auth.uid
}

const wasUserInvitedAndReclaimInvitation = async ({ email, role }) => {
  const iref = await admin
    .firestore()
    .collection('invites')
    .doc(`${email}:${role}`)
    .get()
  if (!iref.exists) return false
  const inviteDoc = iref.data()
  if (inviteDoc.redeemed) return true
  const iref2 = admin
    .firestore()
    .collection('invites')
    .doc(`${email}:${role}`)
  await iref2.update({ redeemed: true, redeemedAt: new Date().toISOString() })
  const iref3 = await admin
    .firestore()
    .collection('invites')
    .doc(`${email}:${role}`)
    .get()
  const { referrerID } = iref3.data()
  const uref = admin
    .firestore()
    .collection('users')
    .doc(referrerID)
  const increment = admin.firestore.FieldValue.increment(1)
  await uref.update({ numInvitesLeft: increment })
  return true
}

exports.createUserDoc = functions.auth.user().onCreate(async user => {
  const userJSONData = JSON.parse(JSON.stringify(user.toJSON()))
  await admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({
      ...userJSONData,
      numInvitesLeft: NUM_DEFAULT_INVITES,
      isProfileComplete: !!isDevelopment,
      isStripeVerified: !!isDevelopment,
      stripeAccountID: isDevelopment ? 'acct_1KCe5c2cSEZKTEoo' : '',
      calendlyURL: isDevelopment ? 'https://calendly.com/carlo-totaldevs/1-on-1' : ''
    })
  if (!user.email) return
  admin
    .firestore()
    .collection('mail')
    .add({
      message: {
        text: JSON.stringify(user.toJSON()),
        subject: user.email + ' ' + user.displayName + ' just joined totaldevs.com !'
      },
      to: ['talent@totaldevs.com'],
      createdAt: new Date().toISOString()
    })
})

exports.handleMatchDoc = functions.firestore.document('matches/{matchID}').onWrite(async (change, context) => {
  const matchID = context.params.matchID
  const newMatch = !change.before.exists
  const prev = change.before.exists ? change.before.data() : null
  const curr = change.after.exists ? change.after.data() : null
  if (!curr) return // case where it got deleted.
  const doc = curr
  const hasStatusChanged = prev && prev.status !== curr.status

  if (hasStatusChanged || newMatch) {
    const statusMapping = {
      dev_interested: {
        role: 'company',
        text: 'there is a new match for your job posting!',
        url: `/matches/${matchID}`,
        email: 'companyEmail',
        emailText: `visit https://totaldevs.com/matches/${matchID} to view the match!`,
        emailSubject: 'there is a new match for your job posting! 🤩'
      },
      position_offered: {
        role: 'dev',
        text: 'you got a job offer!',
        url: `/matches/${matchID}`,
        email: 'devEmail',
        emailText: 'visit https://totaldevs.com/projects to view your offer!',
        emailSubject: 'you just got a job offer! 🤩'
      },
      requesting_dev_status: {
        role: 'dev',
        text: 'you just matched with a company!',
        url: '/projects',
        email: 'devEmail',
        emailText: 'visit https://totaldevs.com/projects to view your match!',
        emailSubject: 'you just got a new job match! 🤩'
      },
      documents_signed: {
        role: 'company',
        text: `${doc.devName} just signed the contract, are you ready to start?`,
        url: `/matches/${doc.matchID}`,
        email: 'companyEmail',
        emailText: `${doc.devName} just signed the contract, are you ready to start 🤩? Visit https://totaldevs.com to view your match and finish the process.`,
        emailSubject: `${doc.devName} just signed the contract, are you ready to start 🤩?`
      },
      active: {
        role: 'dev',
        text: 'you just got hired!',
        url: '/projects',
        email: 'devEmail',
        emailText: 'Congratulations, you landed the job! visit https://totaldevs.com to view your job description and starting date. Expect to see an upfront payment reflected in your account in 3-5 business days.',
        emailSubject: 'you just got hired! 🤩'
      }
    }

    if (!(doc.status) in statusMapping) return
    const obj = statusMapping[doc.status]
    const text = obj.text
    const uid = doc[obj.role]
    const email = obj.email === 'companyEmail' ? doc.jobData.companyEmail : doc[obj.email]
    if (doc.status === 'position_offered') {
      const fields = [{ identifier: 'specific_text', value: doc.job }]
      const signers = [
        {
          role: 'dev',
          name: doc.devName,
          email: doc.devEmail
        },
        {
          role: 'client',
          name: doc.devName,
          email: doc.companyEmail
        }
      ]
      sendEversignDocuments(signers, fields, context.params.matchID)
      admin.firestore()
        .collection('subscriptions')
        .add({
          dev: doc.dev,
          devName: doc.devName,
          company: doc.company,
          explorer: doc.explorer,
          match: matchID,
          job: doc.job
        })
    }
    admin
      .firestore()
      .collection('actions')
      .add({
        uid,
        text,
        seen: false,
        color: 'amber',
        url: obj.url
      })
    admin
      .firestore()
      .collection('mail')
      .add({
        message: {
          text: obj.emailText,
          subject: obj.emailSubject
        },
        to: [email],
        createdAt: new Date().toISOString()
      })
    const ref = admin.firestore().collection('fcmTokens').doc(uid).get()
    if (!ref.exists) return
    const { fcmToken } = ref.data()
    const payload = { data: text, notification: { title: obj.emailSubject, body: text }, token: fcmToken }
    admin.messaging().send(payload)
  }
})

exports.sendEmailOnJobCreate = functions.firestore.document('jobs/{jobID}').onCreate(async (snap, context) => {
  const jobID = context.params.jobID
  const { companyName, company, companyEmail } = snap.data()
  admin
    .firestore()
    .collection('mail')
    .add({
      message: {
        text: JSON.stringify(snap.data()),
        subject: companyEmail + ' ' + companyName + ' ' + company + ' just posted a new position!' + `jobID ${jobID}`
      },
      to: ['talent@totaldevs.com'],
      createdAt: new Date().toISOString()
    })
})

exports.updateUserDoc = functions.firestore.document('users/{uid}').onUpdate(async (change, context) => {
  const after = change.after.exists ? change.after.data() : {}
  const uid = context.params.uid
  const uref = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
  const userDoc = uref.data()
  if (userDoc.role === 'company' && after.displayName !== uref.displayName) {
    admin.firestore().collection('jobs').where('company', '==', uid)
      .get().then((querySnapshot) => {
        querySnapshot.docs.forEach(doc => (doc.ref.update({ companyName: after.displayName })))
      })
  }
  if (userDoc.email) {
    const hasAcceptedInvite = await wasUserInvitedAndReclaimInvitation(userDoc) || !!isDevelopment
    await admin
      .firestore()
      .collection('users')
      .doc(uid)
      .update({ hasAcceptedInvite })
  }
})

exports.handleUserLogin = functions.https.onCall(async (data, ctx) => {
  const uid = isAuthedAndAppChecked(ctx)
  const uref = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
  const { role } = uref.data()
  if (!role || data.converted) {
    const uref2 = admin
      .firestore()
      .collection('users')
      .doc(uid)
    await uref2.update(data)
    if (data.role === 'company') {
      // company adding email, notify us
      admin
        .firestore()
        .collection('mail')
        .add({
          message: {
            text: JSON.stringify(data),
            subject: 'A new company ' + data.email + ' ' + data.displayName + ' ' + uid + ' just joined totaldevs.com!'
          },
          to: ['talent@totaldevs.com'],
          createdAt: new Date().toISOString()
        })
    }
  } else {
    // try redeeming invites by updating the user doc, so the listener can fire.
    const uref2 = admin
      .firestore()
      .collection('users')
      .doc(uid)
    await uref2.update({ lastLogin: new Date().toISOString() })
  }
})

exports.handleAnonUserConversion = functions.https.onCall(async (data, ctx) => {
  const uid = isAuthedAndAppChecked(ctx)
  const uref = admin
    .firestore()
    .collection('users')
    .doc(uid)
  await uref.update({ ...data })
  // we have to add the company data to the job they just posted anonymously
  admin
    .firestore()
    .collection('jobs')
    .where('uid', '==', uid)
    .get()
    .then(snap => {
      snap.docs.forEach(doc => doc.ref.update({ company: uid, companyEmail: data.email }))
    })
})

const triggerOnUpdate = ({ document, fieldToSearch, valueToSearch, destinationField, latestObject }) => {
  const db = admin.firestore()
  return db.collection(document).where(fieldToSearch, '==', valueToSearch)
    .get().then((querySnapshot) => {
      querySnapshot.docs.forEach(doc => (doc.ref.update({ [destinationField]: latestObject })))
    })
}

exports.updateMatchDocOnServer = functions.https.onCall(async (data, ctx) => {
  isAuthedAndAppChecked(ctx)
  const { matchID } = data
  const mref = admin
    .firestore()
    .collection('matches')
    .doc(matchID)
  await mref.update({ ...data })
})

exports.updateJob = functions.firestore.document('jobs/{id}').onUpdate(async (change, context) => {
  const jobid = context.params.id
  const job = change.after.data()
  const triggerList = [
    { document: 'matches', fieldToSearch: 'job', valueToSearch: jobid, destinationField: 'jobData', latestObject: job }
  ]
  triggerList.forEach(triggerOnUpdate)
})

exports.verifyCalendlyUrl = functions.https.onCall(async ({ url }, ctx) => {
  try {
    const response = await fetch(url)
    return { error: !(response.status === 200) }
  } catch (error) {
    return { error: !!error }
  }
})

exports.sendMessage = functions.https.onCall(async ({ text, fcmToken }, ctx) => {
  if (!fcmToken) return { success: true }
  const payload = { data: text, notification: { title: text, body: text }, token: fcmToken }
  return await admin.messaging().send(payload).then((response) => {
    return { success: true }
  }).catch((error) => {
    return { error }
  })
})

const EVERSIGN_SANDBOX = isDevelopment ? 1 : 0
const EVERSIGN_API_KEY = config.eversign.api_key
const EVERSIGN_BUSINESS_ID = config.eversign.business_id
const EVERSIGN_DEV_COMPANY_TEMPLATE_ID = config.eversign.dev_company_template_id
const EVERSIGN_COMPANY_DEV_TEMPLATE_PAYLOAD = {
  sandbox: EVERSIGN_SANDBOX,
  template_id: EVERSIGN_DEV_COMPANY_TEMPLATE_ID,
  title: 'My New Document',
  message: 'This is my message.',
  client: '',
  embedded_signing_enabled: 0,
  signers: [],
  recipients: [],
  fields: []
}

exports.handleEversignEvent = functions.firestore.document('rawEversignEvents/{eventId}').onCreate(async (rawEvent, context) => {
  const event = rawEvent.data()
  const eversignDocumentId = `${event.meta.related_document_hash}`
  const updatedFields = {
    [event.event_type]: true
  }
  if (event.signer) {
    updatedFields[`signers.${event.signer.role}`] = { ...event.signer }
  }

  await admin.firestore().collection('eversignDocuments').doc(eversignDocumentId).set(updatedFields, { merge: true })

  admin.firestore().collection('rawEversignEvents').doc(rawEvent.id).delete()
})

exports.updateDocument = functions.firestore.document('eversignDocuments/{id}').onUpdate(async (change, context) => {
  const document = change.after.data()
  if (document.document_completed) {
    const mref = admin
      .firestore()
      .collection('matches')
      .doc(document.match)
    await mref.update({ status: 'documents_signed' })
  }
})

exports.eversignWebhook = functions.https.onRequest((req, res) => {
  const event = req.body
  const hmac = crypto.createHmac('sha256', EVERSIGN_API_KEY)
  hmac.update(event.event_time.toString() + event.event_type)
  if (hmac.digest('hex') === event.event_hash) {
    admin
      .firestore()
      .collection('rawEversignEvents')
      .add(event)
  }
  res.status(200).send()
})

const sendEversignDocuments = async (signers, fields, match) => {
  let data = {}
  if (isDevelopment) {
    data = {
      ...EVERSIGN_COMPANY_DEV_TEMPLATE_PAYLOAD,
      document_hash: crypto.randomUUID().replaceAll('-', ''),
      fields: [fields]
    }
  } else {
    const response = await fetch(`https://api.eversign.com/api/document?access_key=${EVERSIGN_API_KEY}&business_id=${EVERSIGN_BUSINESS_ID}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...EVERSIGN_COMPANY_DEV_TEMPLATE_PAYLOAD, signers, fields })
      })
    data = await response.json()
  }
  await admin.firestore().collection('eversignDocuments').doc(data.document_hash).set({
    rawDocumentResponse: { ...data, fields: data.fields[0] },
    match,
    originalSigners: signers,
    originalFields: fields
  })
  if (isDevelopment) {
    admin.firestore().collection('eversignDocuments').doc(data.document_hash).set({
      document_completed: true
    }, { merge: true })
  }

}

exports.sendCompanyInvite = functions.https.onCall(async ({ position, devProfile, pitch, explorer, email, bcc }, ctx) => {
  const iref = admin
    .firestore()
    .collection('invites')
    .doc(`${email}:company`)
  if (iref.get().exists) return { error: 'that email has already been invited' }
  const rawHTML = await fs.readFile('templates/invite.html', 'utf-8')
  const data = [
    { tag: '@opening_1@', value: `${position ? (' looking for a ' + position) : ''}` },
    {
      tag: '@opening_2@',
      value: `${devProfile
        ? `, check out this <a href="https://totaldevs.com/resumes?profileID=${devProfile}">potential candidate</a>`
        : ''}`
    },
    { tag: '@pitch@', value: pitch },
    { tag: '@explorer@', value: explorer }
  ]
  const processedHTML = data.reduce((html, { tag, value }) => html.replace(tag, value), rawHTML)
  const subject = 'Have you considered recruiting talent from Latin America?🤔, we might have the perfect fit for your position.'
  const bccData = { bcc: ['talent@totaldevs.com', ...(bcc ? [ctx.auth.token.email] : [])] }
  const mail = await admin
    .firestore()
    .collection('mail')
    .add({
      message: {
        html: processedHTML,
        subject: subject
      },
      to: [email],
      createdAt: new Date().toISOString(),
      ...bccData
    })
  iref.set({
    mailID: mail.id,
    referrer: ctx.auth.token.email,
    referrerID: ctx.auth.uid,
    isActive: false,
    redeemed: false,
    usd: 0,
    createdAt: new Date().toISOString()
  }, { merge: true })
})

const SLACK_HOOK_URL = isDevelopment ? config.slack.dev_hook : config.slack.prod_hook

const slackMapping = {
  matches: {
    listeningFields: ['status'],
    payloadFields: ['status', 'companyName', 'devName', 'explorerName']
  },
  jobs: {
    listeningFields: ['status'],
    payloadFields: ['companyName', 'companyEmail'],
    dumpDocument: true
  },
  eversignDocuments: {
    listeningFields: ['document_completed'],
    payloadFields: ['signers']
  },
  profiles: {
    listeningFields: ['isProfileComplete'],
    payloadFields: ['isProfileComplete', 'providerData']
  },
  users: {
    listeningFields: ['email', 'stripeAccountID'],
    payloadFields: ['email', 'role', 'stripeAccountID', 'hasAcceptedInvite']
  }
}

const didFieldChange = (before, after) => (field) => {
  return (before && before[field] !== after[field])
}

for (const [document, config] of Object.entries(slackMapping)) {
  exports[`${document}SlackNotifier`] = functions.firestore
    .document(`${document}/{docID}`)
    .onWrite((change, context) => {
      const before = change.before.exists ? change.before.data() : {}
      const after = change.after.exists ? change.after.data() : {}
      if (!after) return // case where it got deleted.
      if (!config.listeningFields.some(didFieldChange(before, after))) return null
      const jsonPayload = {
        document,
        action: !change.before.exists ? 'created' : 'updated',
        documentID: context.params.docID,
        ...(config.dumpDocument ? JSON.parse(JSON.stringify(after)) : {}),
        ...config.payloadFields.reduce(
          (result, field) => ({ ...result, [field]: didFieldChange(before, after)(field) ? `${before[field]} -> ${after[field]}` : after[field] }), {}
        )
      }
      const payload = JSON.stringify(jsonPayload, null, 4)

      fetch(SLACK_HOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: `\`\`\`${payload}\`\`\`` })
      })
      return null
    })
}
