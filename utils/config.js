import { initializeApp, getApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import dynamic from 'next/dynamic'
const { initializeAppCheck, ReCaptchaV3Provider } = require('firebase/app-check')

const firebaseConfig = {
  apiKey: 'AIzaSyADYibIu28_bfEasdrkgdMCAcAb64ROlv0',
  authDomain: 'totaldevs-bef40.firebaseapp.com',
  projectId: 'totaldevs-bef40',
  storageBucket: 'totaldevs-bef40.appspot.com',
  messagingSenderId: '377585943710',
  appId: '1:377585943710:web:1d7ea717abd9870e55a78f',
  measurementId: 'G-7BGXW6MV9H'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const functions = getFunctions(app)
const db = getFirestore(app)
const storage = getStorage()
if (typeof window !== 'undefined') {
  const analytics = getAnalytics(app)
}

if (process.env.NODE_ENV !== 'production') {
  connectStorageEmulator(storage, '127.0.0.1', 9199)
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFunctionsEmulator(functions, 'localhost', 5001)
  connectFirestoreEmulator(db, 'localhost', 8080)
}
/*
this is dumb and possibly wrong. looks like NEXT tries to SSR
this component (possibly from an import) and fails because `document` is not available to NODE
maybe dynamically import {app, auth, functions...} on the components that need it?
*/
// if (typeof window !== 'undefined') {
//   const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY
//   const recaptchaProvider = new ReCaptchaV3Provider(siteKey)
//   initializeAppCheck(app, {
//     provider: recaptchaProvider,
//     // Optional argument. If true, the SDK automatically refreshes App Check
//     // tokens as needed.
//     isTokenAutoRefreshEnabled: true
//   })
// }

export { app, auth, functions, db, firebaseConfig, storage }
