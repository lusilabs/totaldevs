import React, { useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { getMessaging, onMessage, getToken } from 'firebase/messaging'
import { toast } from 'react-toastify'
import Header from '@/components/header'
import { vapidKeyFCM, db } from '@/utils/config'

function Layout ({ children, ...props }) {
  const messaging = getMessaging()

  onMessage(messaging, (payload) => {
    // console.log('Message received in foreground: ', payload)
    toast.success(payload.notification.body)
  })

  useEffect(() => {
    if (!props.userDoc) {
      return
    }
    getToken(messaging, { vapidKey: vapidKeyFCM }).then((fcmToken) => {
      if (fcmToken) {
        const tokenref = doc(db, 'fcmTokens', props.userDoc.uid)
        setDoc(tokenref, {
          fcmToken
        }, { merge: true })
      } else {
        console.log('No registration token available. Request permission to generate one.')
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err)
    })
  }, [])

  return (
    <>
      {props.userDoc && <Header {...props} />}
      <main>
        {children}
      </main>
    </>
  )
}

export default Layout
