import Banner from '@/components/banner'
import { useEffect, useState } from 'react'
import { handleDevStripeOnboarding } from '@/utils/stripe'

function PendingBanners ({ userDoc, setIsPageLoading, ...props }) {
  const [isStripeBannerActive, setIsStripeBannerActive] = useState(false)
  const [isInviteBannerActive, setIsInviteBannerActive] = useState(false)
  const [isProfileBannerActive, setIsProfileBannerActive] = useState(false)
  const [isCalendlyBannerActive, setIsCalendlyBannerActive] = useState(false)

  useEffect(() => {
    setIsProfileBannerActive(!userDoc.profileComplete)
    setIsStripeBannerActive(userDoc.profileComplete && !userDoc.stripeVerified)
    setIsInviteBannerActive(userDoc.numInvitesLeft > 0)
    setIsCalendlyBannerActive(!userDoc.calendlyUrl)
  }, [userDoc])

  return (
    <div>
      {userDoc.role !== 'company' && isStripeBannerActive &&
        <Banner
          name='dev-stripe-onboarding' color='bg-yellow-600' text='verify your account to start matching'
          buttonText='click here' handleClick={() => handleDevStripeOnboarding(userDoc, setIsPageLoading)}
        />}
      {isProfileBannerActive &&
        <Banner
          name='profile-complete' color='bg-red-400' text='your profile is incomplete'
          buttonText='go to profile' href='/profile'
        />}
      {userDoc.role === 'explorer' && isInviteBannerActive &&
        <Banner
          name='explorer-invites' color='bg-indigo-600' text='you have new gift developer invites!'
          buttonText='invite a dev!' href='/invites' handleClose={() => setIsInviteBannerActive(false)}
        />}
      {userDoc.role === 'dev' && isCalendlyBannerActive &&
        <Banner
          name='calendly-complete' color='bg-yellow-600' text='setup your calendly for the companies to schedule calls with you'
          buttonText='go to profile' href='/profile'
        />}
    </div>
  )
}

export default PendingBanners
