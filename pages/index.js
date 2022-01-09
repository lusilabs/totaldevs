import { logEvent } from 'firebase/analytics'
import { useEffect } from 'react'
import Dashboard from './dashboard'
import Landing from '@/components/landing'
import { analytics } from '@/utils/config'

export default function Index ({ userDoc, handleCreateJobPosting, ...props }) {
  useEffect(() => {
    logEvent(analytics, 'New visit v2. how do I log more data?')
  }, [])

  // this doesn't work for popUp login, I think I needed to do 'loginWithRedirect', not using for now.
  // this may be only for email login.
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
      {!userDoc && <Landing handleCreateJobPosting={handleCreateJobPosting} {...props} />}
    </>
  )
}
