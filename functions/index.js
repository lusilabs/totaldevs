const functions = require('firebase-functions')
const admin = require('firebase-admin')
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
      numInvitesLeft: NUM_DEFAULT_INVITES
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
  // const matchID = context.params.matchID
  const newMatch = !change.before.exists
  const prev = change.before.exists ? change.before.data() : null
  const curr = change.after.exists ? change.after.data() : null
  if (!curr) return // case where it got deleted.
  const doc = curr
  const hasStatusChanged = prev && prev.status !== curr.status

  if (hasStatusChanged || newMatch) {
    const statusMapping = {
      position_offered: {
        role: 'dev',
        text: 'you got a job offer!',
        url: '/projects',
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
        emailSubject: 'you just got a job offer! 🤩'
      },
      dev_interested: {
        role: 'company',
        text: 'there is a new match for your job posting!',
        url: `/jobs/${doc.job}`,
        emailText: `visit https://totaldevs.com/jobs/${doc.job} to view it.`,
        emailSubject: 'there is a new match for your job posting! 🤩',
        email: 'companyEmail'
      }
    }

    const obj = statusMapping[doc.status]
    const text = obj.text
    const uid = doc[obj.role]
    const email = obj.email === 'companyEmail' ? doc.jobData.companyEmail : doc[obj.email]

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

exports.sendEmailOnJobCreate = functions.firestore.document('jobs/{jobID}').onCreate(async (change, context) => {
  const jobID = context.params.jobID
  const { companyName, company, companyEmail } = snap.data()
  admin
    .firestore()
    .collection('mail')
    .add({
      message: {
        text: JSON.stringify(snap.data()),
        subject: companyEmail + ' ' + companyName + ' ' + company + ' just posted a new position!'
      },
      to: ['talent@totaldevs.com'],
      createdAt: new Date().toISOString()
    })
})

exports.updateUserDoc = functions.firestore.document('users/{uid}').onUpdate(async (change, context) => {
  const uid = context.params.uid
  const uref = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
  const userDoc = uref.data()
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
  if (!role || data.convert) {
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
})

exports.getAssignments = functions.https.onCall(async (data, ctx) => {
  const db = admin.firestore()
  const uid = ctx.auth.uid
  const assignments = await db.collection('matches').where('dev', '==', uid)
    .get().then((querySnapshot) => {
      return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
    })
  const actors = await db.collection('users')
    .where('uid', 'in',
      [...new Set(assignments.reduce((result, assignment) => [...result, assignment.explorer, assignment.company], []))]
    )
    .get().then((querySnapshot) => {
      return querySnapshot.docs.reduce((result, doc) => ({ ...result, [doc.id]: doc.data() }), {})
    })
  const jobs = await db.collection('jobs')
    .where('__name__', 'in', assignments.map((assignment) => assignment.job))
    .get().then((querySnapshot) => {
      return querySnapshot.docs.reduce((result, doc) => ({ ...result, [doc.id]: doc.data() }), {})
    })

  return assignments.map((assignment) => (
    {
      ...assignment,
      explorer: actors[assignment.explorer],
      company: actors[assignment.company],
      job: jobs[assignment.job]
    }))
})

const triggerOnUpdate = ({ document, fieldToSearch, valueToSearch, destinationField, latestObject }) => {
  const db = admin.firestore()
  return db.collection(document).where(fieldToSearch, '==', valueToSearch)
    .get().then((querySnapshot) => {
      querySnapshot.docs.forEach(doc => (doc.ref.update({ [destinationField]: latestObject })))
    })
}

exports.updateJob = functions.firestore.document('jobs/{id}').onUpdate(async (change, context) => {
  const jobid = context.params.id
  const job = change.after.data()
  const triggerList = [
    { document: 'matches', fieldToSearch: 'job', valueToSearch: jobid, destinationField: 'jobData', latestObject: job }
  ]
  triggerList.forEach(triggerOnUpdate)
})

exports.sendMessage = functions.https.onCall(async ({ text, fcmToken }, ctx) => {
  if (!fcmToken) return { success: true }
  const payload = { data: text, notification: { title: text, body: text }, token: fcmToken }
  return await admin.messaging().send(payload).then((response) => {
    return { success: true }
  }).catch((error) => {
    return { error: error.code }
  })
})
