import Banner from '@/components/banner'
import { useEffect, useState } from 'react'
import { handleDevStripeOnboarding } from '@/utils/stripe'

function PendingBanners({ userDoc, setIsPageLoading, ...props }) {
  const [isStripeBannerActive, setIsStripeBannerActive] = useState(false)
  const [isInviteBannerActive, setIsInviteBannerActive] = useState(false)
  const [isProfileBannerActive, setIsProfileBannerActive] = useState(false)
  const [isEmailBannerActive, setIsEmailBannerActive] = useState(false)
  const [isCalendlyBannerActive, setIsCalendlyBannerActive] = useState(false)

  useEffect(() => {
    setIsProfileBannerActive(!userDoc.isProfileComplete)
    setIsStripeBannerActive(userDoc.isProfileComplete && !userDoc.isStripeVerified)
    setIsInviteBannerActive(userDoc.numInvitesLeft > 0)
    setIsCalendlyBannerActive(!userDoc.calendlyURL)
    setIsEmailBannerActive(!userDoc.emailVerified)
  }, [userDoc])

  return (
    <div>
      {userDoc.role !== 'company' && isStripeBannerActive &&
        <Banner
          name='dev-stripe-onboarding' color='bg-yellow-600' text='verify your account to start matching'
          buttonText='click here' handleClick={() => handleDevStripeOnboarding(userDoc, setIsPageLoading)}
        />}
      {userDoc.role === 'company' && isEmailBannerActive &&
        <Banner
          name='email-verification' color='bg-yellow-600' text='verify your email to start matching'
          buttonText='go to profile' href='/profile'
        />}
      {isProfileBannerActive &&
        ['dev', 'explorer'].includes(userDoc.role) &&
        <Banner
          name='profile-complete' color='bg-red-400' text='complete your profile to start matching'
          buttonText='go to profile' href='/profile'
        />}
      {userDoc.role === 'dev' && isEmailBannerActive && !isProfileBannerActive &&
        <Banner
          name='email-verification' color='bg-yellow-600' text='verify your email to start matching'
          buttonText='go to profile' href='/profile'
        />}
      {userDoc.role === 'explorer' && isInviteBannerActive &&
        <Banner
          name='explorer-invites' color='bg-indigo-600' text='you have new gift developer invites!'
          buttonText='invite a dev!' href='/invites' handleClose={() => setIsInviteBannerActive(false)}
        />}
      {userDoc.role === 'dev' && isCalendlyBannerActive &&
        <Banner
          name='calendly-complete' color='bg-yellow-600' text='setup your calendly for companies to schedule calls with you'
          buttonText='go to profile' href='/profile'
        />}
    </div>
  )
}

export default PendingBanners
