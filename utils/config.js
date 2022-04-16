import { initializeApp, getApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'
// anothr method of getting things only on the client
// import dynamic from 'next/dynamic'
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

const vapidKeyFCM = 'BG_67u9DP6hm1El1fX73jbf3yTwK92Rp0dwnFyP6IM6WEcuUBIJp7WpLsH7gnn39gDy28Bf8Nps-U5ycerlsykU'

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const functions = getFunctions(app)
const db = getFirestore(app)
const storage = getStorage()
let analytics
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app)
}

if (process.env.NODE_ENV !== 'production') {
  connectStorageEmulator(storage, '127.0.0.1', 9199)
  connectAuthEmulator(auth, 'http://localhost:9099')
  connectFunctionsEmulator(functions, 'localhost', 5001)
  connectFirestoreEmulator(db, 'localhost', 8081)
}
/*
this is a workaround for nextjs. because it tries to SSR
this component (possibly from an import) and fails because `document` is not available to NODE
maybe dynamically import {app, auth, functions...} on the components that need it?
*/
if (typeof window !== 'undefined') {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_PUBLIC_KEY
  const recaptchaProvider = new ReCaptchaV3Provider(siteKey)
  initializeAppCheck(app, {
    provider: recaptchaProvider,
    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
  })
}

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://totaldevs.com',
  // This must be true.
  handleCodeInApp: true
  // iOS: {
  //   bundleId: 'com.example.ios'
  // },
  // android: {
  //   packageName: 'com.example.android',
  //   installApp: true,
  //   minimumVersion: '12'
  // },
  // dynamicLinkDomain: 'example.page.link'
}

export { app, auth, functions, db, firebaseConfig, storage, analytics, vapidKeyFCM, actionCodeSettings }
