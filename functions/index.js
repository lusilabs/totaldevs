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

exports.sendMessage = functions.https.onCall(async ({ text, fcmToken }, ctx) => {
  if (!fcmToken) return { success: true }
  const payload = { data: text, notification: { title: text, body: text }, token: fcmToken }
  console.log(payload)
  return await admin.messaging().send(payload).then((response) => {
    console.log('message sent', response)
    return { success: true }
  }).catch((error) => {
    return { error: error.code }
  })
})
