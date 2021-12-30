
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Stripe = require('stripe')
admin.initializeApp()
const logger = functions.logger
const config = functions.config()
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG)
const isDevelopment = process.env.FUNCTIONS_EMULATOR
const STRIPE_SECRET = isDevelopment ? config.stripe.secret_key_dev : config.stripe.secret_key_prod
// const STRIPE_WEBHOOK_SECRET = isDevelopment ? config.stripe.webhook_secret_dev : config.stripe.webhook_secret_prod
// const STRIPE_RETURN_URL = isDevelopment ? config.stripe.return_url_dev : config.stripe.return_url_prod
// const STRIPE_REFRESH_URL = isDevelopment ? config.stripe.refresh_url_dev : config.stripe.refresh_url_prod

// const STRIPE_CHECKOUT_SUCCESS_URL = isDevelopment ? config.stripe.checkout_success_url_dev : config.stripe.checkout_success_url_prod
// const STRIPE_CHECKOUT_CANCEL_URL = isDevelopment ? config.stripe.checkout_cancel_url_dev : config.stripe.checkout_cancel_url_prod

// const OWNER_STRIPE_CHECKOUT_SUCCESS_URL = isDevelopment ? config.stripe.owner_checkout_success_url_dev : config.stripe.owner_checkout_success_url_prod
// const OWNER_STRIPE_CHECKOUT_CANCEL_URL = isDevelopment ? config.stripe.owner_checkout_cancel_url_dev : config.stripe.owner_checkout_cancel_url_prod
// const OWNER_PORTAL_RETURN_URL = isDevelopment ? config.stripe.owner_portal_return_dev : config.stripe.owner_portal_return_prod
// const CUSTOMER_PORTAL_RETURN_URL = isDevelopment ? config.stripe.customer_portal_return_dev : config.stripe.customer_portal_return_prod
const DEFAULT_DEV_INVITES = 3
const DEFAULT_EXPLORER_INVITES = 10

// const stripe = Stripe(STRIPE_SECRET)
const isAuthed = ctx => {
  if (!ctx.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.')
  }
}

// const isAppChecked = ctx => {
//   if (!isDevelopment && !ctx.app) {
//     throw new functions.https.HttpsError('failed-precondition', 'The function must be called from an App Check verified app.')
//   }
// }

const isAuthedAndAppChecked = ctx => {
  isAuthed(ctx)
  // isAppChecked(ctx)
  return ctx.auth.uid
}

exports.createUserDoc = functions.auth.user().onCreate(async user => {
  const userJSONData = JSON.parse(JSON.stringify(user.toJSON()))
  await admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({
      ...userJSONData,
      hasAcceptedInvite: !!isDevelopment,
      numInvitesLeft: DEFAULT_DEV_INVITES
    })
})

exports.handleUserLogin = functions.https.onCall(async (data, ctx) => {
  const uid = isAuthedAndAppChecked(ctx)
  const uref = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
  const { role, email, hasAcceptedInvite } = uref.data()
  const uref2 = await admin
    .firestore()
    .collection('users')
    .doc(uid)
  if (role) {
    if (role === 'dev' && !hasAcceptedInvite) {
      // try redeeming any invites automatically
      const iref = await admin
        .firestore()
        .collection('invites')
        .doc(email)
        .get()
      if (iref.exists) {
        const { redeemed } = iref.data()
        if (!redeemed) {
          const iref2 = await admin
            .firestore()
            .collection('invites')
            .doc(email)
          uref2.update({ hasAcceptedInvite: true })
          iref2.update({ redeemed: true, redeemedAt: new Date().toISOString() })
        }
      }
    }
    // if we have a role, just return. don't update any data as the user is already set.
    return
  }
  // first time logging in
  await uref2.update(data)
})

exports.handleAnonUserConversion = functions.https.onCall(async (data, ctx) => {
  const uid = isAuthedAndAppChecked(ctx)
  const uref = await admin
    .firestore()
    .collection('users')
    .doc(uid)
  logger.info('handleAnonUserConversion ', data)
  await uref.update({ ...data, numInvitesLeft: data.role === 'explorer' ? DEFAULT_EXPLORER_INVITES : 0 })
})

exports.handleWebhooks = functions.https.onRequest(async (req, resp) => {
  let event
  let stripe
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET)
    // todo@carlo-stripe this is dumb. WHY can Connect test events go to live mode? ask stripe cc.
    if (!isDevelopment && !event.data.livemode) {
      resp.status(406).send('Why?')
      return
    }
  } catch (error) {
    logger.error(error)
    resp.status(401).send('Webhook Error: Invalid Secret')
    return
  }
  logger.info('Processing webhook', { type: event.type })
  try {
    switch (event.type) {
      default:
        logger.error(new Error('Unhandled relevant event!'), { type: event.type })
    }
  } catch (error) {
    resp.json({
      error: 'Webhook handler failed. View function logs in Firebase.'
    })
    return
  }
  resp.json({ received: true })
})
