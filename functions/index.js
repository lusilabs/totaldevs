const functions = require('firebase-functions')
const logger = functions.logger
const config = functions.config()
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG)
const isDevelopment = process.env.FUNCTIONS_EMULATOR

exports.stripe = require('./stripe')
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello from Firebase!')
})
