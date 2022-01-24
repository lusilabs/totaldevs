// Can't use ES6 modules in service worker for some reason, using old syntax instead

importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyADYibIu28_bfEasdrkgdMCAcAb64ROlv0',
  authDomain: 'totaldevs-bef40.firebaseapp.com',
  projectId: 'totaldevs-bef40',
  storageBucket: 'totaldevs-bef40.appspot.com',
  messagingSenderId: '377585943710',
  appId: '1:377585943710:web:1d7ea717abd9870e55a78f',
  measurementId: 'G-7BGXW6MV9H'
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()
