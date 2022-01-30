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

const wasUserInvitedAndReclaimInvitation = async email => {
  logger.info({ email })
  const iref = await admin
    .firestore()
    .collection('invites')
    .doc(email)
    .get()
  logger.info({ exists: iref.exists })
  if (!iref.exists) return false
  const iref2 = admin
    .firestore()
    .collection('invites')
    .doc(email)
  await iref2.update({ redeemed: true, redeemedAt: new Date().toISOString() })
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
    const hasAcceptedInvite = await wasUserInvitedAndReclaimInvitation(userDoc.email) || !!isDevelopment
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
  } else {
  // try redeeming invites by updating the user doc
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
  const assignments = await db.collection('assignments').where('dev', '==', uid)
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
