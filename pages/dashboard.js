import Banner from '@/components/banner'
import { auth, db, functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
// import DashboardActions from '@/components/dashboardactions'

const generateOnboardingURL = httpsCallable(functions, 'stripe-generateOnboardingURL')

function Dashboard ({ userDoc, setIsPageLoading, ...props }) {
  const router = useRouter()
  const [isStripeBannerActive, setIsStripeBannerActive] = useState(true)
  const [isInviteBannerActive, setIsInviteBannerActive] = useState(true)
  const [isProfileBannerActive, setIsProfileBannerActive] = useState(true)
  const handleDevStripeOnboarding = async userDoc => {
    setIsPageLoading(true)
    const { data: url } = await generateOnboardingURL(userDoc)
    setIsPageLoading(false)
    window.location.assign(url)
  }

  const { stripe_redirect_success, stripe_redirect_failure } = router.query

  useEffect(() => {
    if (stripe_redirect_success) toast.success('processing...')
    if (stripe_redirect_failure) {
      toast.warn('link expired, redirecting...')
      handleDevStripeOnboarding(userDoc)
    }
    setIsProfileBannerActive(!userDoc.isProfileComplete)
    setIsStripeBannerActive(userDoc.isProfileComplete && !stripe_redirect_success && !userDoc.stripeVerified)
    setIsInviteBannerActive(userDoc.numInvitesLeft > 0)
  }, [])

  return (
    <div>
      {userDoc.role !== 'company' && isStripeBannerActive && <Banner name='dev-stripe-onboarding' color='bg-yellow-600' text='verify your account to start matching' buttonText='click here' handleClick={() => handleDevStripeOnboarding(userDoc)} handleClose={() => setIsStripeBannerActive(false)} />}
      {isProfileBannerActive && <Banner name='profile-complete' color='bg-red-400' text='your profile is incomplete' buttonText='go to profile' href='/profile' handleClose={() => setIsProfileBannerActive(false)} />}
      {userDoc.role === 'explorer' && isInviteBannerActive && <Banner name='explorer-invites' color='bg-indigo-600' text='you have new gift developer invites!' buttonText='invite a dev!' href='/invites' handleClose={() => setIsInviteBannerActive(false)} />}
      {/* <DashboardActions userDoc={userDoc} setIsPageLoading={setIsPageLoading} {...props} /> */}
    </div>
  )
}

export default Dashboard
