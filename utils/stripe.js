
import { functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'

const generateOnboardingURL = httpsCallable(functions, 'stripe-generateOnboardingURL')

export const handleDevStripeOnboarding = async (userDoc, setLoading) => {
  setLoading(true)
  const { data: url } = await generateOnboardingURL(userDoc)
  setLoading(false)
  window.location.assign(url)
}
