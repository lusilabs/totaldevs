import Banner from '@/components/banner'
import { auth, db, functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const generateOnboardingURL = httpsCallable(functions, 'stripe-generateOnboardingURL')

function Dashboard ({ userDoc, setIsPageLoading, ...props }) {
  const router = useRouter()
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
  }, [])

  return (
    <div>
      {userDoc.role === 'explorer' && !stripe_redirect_success && <Banner name='explorer-invites' text='congratulations! you have 10 gift developer invites' buttonText='invite a dev!' href='/invites' />}
      {userDoc.role === 'dev' && !stripe_redirect_success && !userDoc.stripeVerified && <Banner name='dev-stripe-onboarding' color='bg-yellow-600' text='verify your account to start matching' buttonText='click here' handleClick={() => handleDevStripeOnboarding(userDoc)} />}
      dashboard.
    </div>
  )
}

export default Dashboard
