
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Stripe = require('stripe')
const logger = functions.logger
const config = functions.config()
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG)

const isDevelopment = process.env.FUNCTIONS_EMULATOR
const STRIPE_SECRET = isDevelopment ? config.stripe.secret_key_dev : config.stripe.secret_key_prod
const STRIPE_WEBHOOK_SECRET = isDevelopment ? config.stripe.webhook_secret_dev : config.stripe.webhook_secret_prod
const STRIPE_RETURN_URL = isDevelopment ? config.stripe.return_url_dev : config.stripe.return_url_prod
const STRIPE_REFRESH_URL = isDevelopment ? config.stripe.refresh_url_dev : config.stripe.refresh_url_prod
const STRIPE_CHECKOUT_SUCCESS_URL = isDevelopment ? config.stripe.checkout_success_url_dev : config.stripe.checkout_success_url_prod
const STRIPE_CHECKOUT_CANCEL_URL = isDevelopment ? config.stripe.checkout_cancel_url_dev : config.stripe.checkout_cancel_url_prod

// const OWNER_STRIPE_CHECKOUT_SUCCESS_URL = isDevelopment ? config.stripe.owner_checkout_success_url_dev : config.stripe.owner_checkout_success_url_prod
// const OWNER_STRIPE_CHECKOUT_CANCEL_URL = isDevelopment ? config.stripe.owner_checkout_cancel_url_dev : config.stripe.owner_checkout_cancel_url_prod
// const OWNER_PORTAL_RETURN_URL = isDevelopment ? config.stripe.owner_portal_return_dev : config.stripe.owner_portal_return_prod
const CUSTOMER_PORTAL_RETURN_URL = isDevelopment ? config.stripe.customer_portal_return_dev : config.stripe.customer_portal_return_prod
const stripe = Stripe(STRIPE_SECRET)
const NUM_DEFAULT_INVITES = 3
const APPLICATION_FEE_PERCENT = 4

// const stripe = Stripe(STRIPE_SECRET)
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

exports.generateOnboardingURL = functions.https.onCall(async (_, ctx) => {
  const uid = isAuthedAndAppChecked(ctx)
  const uref = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
  let stripeAccountID
  const userDoc = uref.data()
  stripeAccountID = userDoc.stripeAccountID
  if (!stripeAccountID) {
    const stripeAccount = await createStripeConnectExpressAccount(userDoc)
    stripeAccountID = stripeAccount.id
    const uref2 = admin
      .firestore()
      .collection('users')
      .doc(uid)
    uref2.update({ stripeAccountID })
  }
  const { url } = await stripe.accountLinks.create({
    account: stripeAccountID,
    refresh_url: STRIPE_REFRESH_URL,
    return_url: STRIPE_RETURN_URL,
    type: 'account_onboarding'
  })
  return url
})

exports.checkStripeAccountStanding = functions.https.onCall(async (_, ctx) => {
  const uid = isAuthedAndAppChecked(ctx)
  const uref = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
  const { stripeAccountID } = uref.data()
  if (!stripeAccountID) return
  const stripeAccount = await stripe.accounts.retrieve(stripeAccountID)
  const { details_submitted, charges_enabled } = stripeAccount
  const uref2 = admin
    .firestore()
    .collection('users')
    .doc(uid)
  const isStripeVerified = stripeAccount.details_submitted && stripeAccount.charges_enabled
  uref2.update({ details_submitted, charges_enabled, isStripeVerified })
})

exports.generateExpressDashboardLink = functions.https.onCall(async (_, ctx) => {
  const uid = isAuthedAndAppChecked(ctx)
  const ref = await admin
    .firestore()
    .collection('users')
    .doc(uid)
    .get()
  const { stripeAccountID } = ref.data()
  const { url } = await stripe.accounts.createLoginLink(stripeAccountID)
  return url
})

exports.generateCompanyDashboardLink = functions.https.onCall(async (data, ctx) => {
  const uid = isAuthedAndAppChecked(ctx)
  let customer, stripeAccount
  const sref = await admin
    .firestore()
    .collection('subscriptions')
    .where('match', '==', data.matchID)
    .limit(1)
    .get()
    .then(async snap => {
      const doc = snap.docs[0]
      const data = doc.data()
      customer = data.customer
      const uref = await admin
        .firestore()
        .collection('users')
        .doc(data.dev)
        .get()
      stripeAccount = uref.data().stripeAccountID
    })
  const { url } = await stripe.billingPortal.sessions.create({
    customer,
    return_url: CUSTOMER_PORTAL_RETURN_URL
    // on_behalf_of: stripeAccount
  }, { stripeAccount })
  return url
})

const createStripeConnectExpressAccount = async user => {
  const data = {
    type: 'express',
    email: user.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    },
    metadata: {
      firebaseUID: user.uid
    }
  }
  const account = await stripe.accounts.create(data)
  // configure the customer portal..
  const billingPortal = await stripe.billingPortal.configurations.create({
    features: {
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true }
    },
    business_profile: {
      privacy_policy_url: 'https://totaldevs.com/privacy'
    },
    default_return_url: CUSTOMER_PORTAL_RETURN_URL
  }, { stripeAccount: account.id })
  return account
}

exports.constructStripeModels = functions.firestore.document('subscriptions/{subID}').onCreate(async (snap, context) => {
  const subID = context.params.subID
  const { dev, company, match, job } = snap.data()
  const uref = await admin
    .firestore()
    .collection('users')
    .doc(dev)
    .get()
  const { stripeAccountID } = uref.data()
  const cref = await admin
    .firestore()
    .collection('users')
    .doc(company)
    .get()
  const { email, displayName, uid } = cref.data()
  const { id: customer } = await stripe.customers.create({
    email,
    name: displayName,
    metadata: {
      companyID: uid,
      matchID: match
    }
  }, { stripeAccount: stripeAccountID })
  const jref = await admin
    .firestore()
    .collection('jobs')
    .doc(job)
    .get()
  const { photoURL, description, title } = jref.data()
  const mref = await admin
    .firestore()
    .collection('matches')
    .doc(match)
    .get()
  const { finalSalary } = mref.data()
  const images = [photoURL]
  const { id: product } = await stripe.products.create({
    name: title, description, images
  }, { stripeAccount: stripeAccountID })

  const unit_amount = (100 * Number(finalSalary)).toFixed(0)
  const { id: price } = await stripe.prices.create({
    currency: 'usd', product, unit_amount, recurring: { interval: 'month' }
  }, { stripeAccount: stripeAccountID })

  return snap.ref.set({ customer, product, price, status: 'pending_payment', finalSalary, description, title, photoURL }, { merge: true })
})

exports.createCheckoutSession = functions.https.onCall(async (data, ctx) => {
  const subDoc = await admin
    .firestore()
    .collection('subscriptions')
    .where('match', '==', data.match)
    .limit(1)
    .get()
    .then(d => d.docs[0].data())

  const { price, company, dev, job, match, customer } = subDoc

  const uref = await admin
    .firestore()
    .collection('users')
    .doc(dev)
    .get()
  const { stripeAccountID: stripeAccount } = uref.data()

  const session = await stripe.checkout.sessions.create({
    success_url: STRIPE_CHECKOUT_SUCCESS_URL,
    cancel_url: STRIPE_CHECKOUT_CANCEL_URL,
    payment_method_types: ['card'],
    line_items: [
      { price, quantity: 1 }
    ],
    mode: 'subscription',
    subscription_data: {
      application_fee_percent: APPLICATION_FEE_PERCENT
    },
    customer,
    metadata: {
      company, dev, job, match
    }

  }, { stripeAccount })

  return session
})

const updateStripeAccount = async account => {
  const { id: stripeAccountID, charges_enabled, payouts_enabled } = account
  const isStripeVerified = charges_enabled && payouts_enabled
  const uref = await admin
    .firestore()
    .collection('users')
    .where('stripeAccountID', '==', stripeAccountID)
    .limit(1)
    .get()
    .then(snap => {
      const doc = snap.docs[0]
      doc.ref.update({ charges_enabled, payouts_enabled, isStripeVerified })
    })
  return null
}

const handleCheckoutSessionCompleted = session => {
  admin
    .firestore()
    .collection('subscriptions')
    .where('match', '==', session.metadata.match)
    .limit(1)
    .get()
    .then(snap => {
      const doc = snap.docs[0]
      doc.ref.update({ subscription: session.subscription })
    })
  admin
    .firestore()
    .collection('matches')
    .doc(session.metadata.match)
    .update({ status: 'first_payment' })
}

const handleInvoiceUpdate = async invoice => {
  admin
    .firestore()
    .collection('subscriptions')
    .where('subscription', '==', invoice.subscription)
    .limit(1)
    .get()
    .then(snap => {
      const doc = snap.docs[0]
      doc.ref.update({ status: invoice.status })
      const subData = doc.data()
      if (invoice.status === 'paid') {
        admin
          .firestore()
          .collection('jobs')
          .doc(subData.job)
          .update({ status: 'locked' })
        admin
          .firestore()
          .collection('matches')
          .doc(subData.match)
          .update({ status: 'active' })
      }
    })
}

const handleSubscriptionCreated = async sub => {
  admin
    .firestore()
    .collection('subscriptions')
    .where('price', '==', sub.plan.id)
    .limit(1)
    .get()
    .then(snap => {
      const doc = snap.docs[0]
      doc.ref.update({ subscription: sub.id })
    })
}

exports.handleWebhooks = functions.https.onRequest(async (req, resp) => {
  let event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET)
    // todo@carlo-stripe this is dumb. WHY can Connect test events go to live mode? ask stripe cc.
    if (!isDevelopment && !event.data.livemode) {
      resp.status(406).send('Why Stripe?')
      return
    }
  } catch (error) {
    logger.error(error)
    resp.status(401).send('Webhook Error: Invalid Secret')
    return
  }
  logger.info('Processing webhook', { type: event.type, event })
  try {
    switch (event.type) {
      case 'account.updated':
        await updateStripeAccount(event.data.object)
        break
      case 'invoice.paid':
      case 'invoice.payment_failed':
        handleInvoiceUpdate(event.data.object)
        break
      case 'checkout.session.completed':
        handleCheckoutSessionCompleted(event.data.object)
        break
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      default:
        logger.error(new Error('Unhandled event!'), { type: event.type })
    }
  } catch (error) {
    resp.json({
      error: 'Webhook handler failed. View function logs in Firebase.'
    })
    return
  }
  resp.json({ received: true })
})
