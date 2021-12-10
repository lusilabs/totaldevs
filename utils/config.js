import { initializeApp, getApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
import dynamic from 'next/dynamic'
const { initializeAppCheck, ReCaptchaV3Provider } = require('firebase/app-check')

const firebaseConfig = {
  apiKey: 'AIzaSyBeT-KuLZkrUmQFdM38ErfGK8ys3iT_9eg',
  authDomain: 'test1-1755d.firebaseapp.com',
  databaseURL: 'https://test1-1755d-default-rtdb.firebaseio.com',
  projectId: 'test1-1755d',
  storageBucket: 'test1-1755d.appspot.com',
  messagingSenderId: '787081418223',
  appId: '1:787081418223:web:63574a0ff24df93736521a',
  measurementId: 'G-E35TKW925G'
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
