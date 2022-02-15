import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { logEvent } from 'firebase/analytics'
import { useRouter } from 'next/router'
import Landing from '@/components/landing'
import { analytics } from '@/utils/config'
import { handleDevStripeOnboarding } from '@/utils/stripe'
import Dashboard from './dashboard'

export default function Index ({ userDoc, handleCreateJobPosting, ...props }) {
  const router = useRouter()
  const { stripe_redirect_success, stripe_redirect_failure } = router.query

  useEffect(() => {
    if (stripe_redirect_success) toast.success('processing...')
    if (stripe_redirect_failure) {
      toast.warn('link expired, redirecting...')
      handleDevStripeOnboarding(userDoc, props.setIsPageLoading)
    }
  }, [])

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
      {userDoc && <Dashboard userDoc={userDoc} {...props} />}
      {!userDoc && <Landing handleCreateJobPosting={handleCreateJobPosting} {...props} />}
    </>
  )
}
