import { getAnalytics, logEvent } from 'firebase/analytics'
import { useEffect } from 'react'
import Dashboard from './dashboard'
import Landing from '@/components/landing'

export default function Index ({ userDoc, handleWorkWithUs, ...props }) {
  useEffect(() => {
    const analytics = getAnalytics()
    logEvent(analytics, 'New visit.')
  }, [])

  // this doesn't work for popUp login, I think I needed to do 'loginWithRedirect', not using for now.
  // const checkUserCreate = async () => {
  //   const result = await getRedirectResult(auth)
  //   console.log('useEffect landing')
  //   console.info(result)
  // }
  // useEffect(() => {
  //   checkUserCreate()
  // })

  return (
    <>
      {/* {userDoc && userDoc.role === 'dev' && <Dashboard userDoc={userDoc} {...props} />} */}
      {userDoc && <Dashboard userDoc={userDoc} {...props} />}
      {!userDoc && <Landing handleWorkWithUs={handleWorkWithUs} {...props} />}
    </>
  )
}
