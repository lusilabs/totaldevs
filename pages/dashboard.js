import Banner from '@/components/banner'
import { auth, db, functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDocuments } from '@/utils/hooks'
import { getDoc, getDocs, collection, doc, query, limit, where, orderBy } from '@firebase/firestore'
import { SuspensePlaceholders } from '@/components/suspense'
import Link from 'next/link'
// import DashboardActions from '@/components/dashboardactions'

const generateOnboardingURL = httpsCallable(functions, 'stripe-generateOnboardingURL')

const queryConstraints = [where('seen', '==', false), orderBy('priority', 'desc'), limit(10)]

function Dashboard ({ userDoc, setIsPageLoading, ...props }) {
  const router = useRouter()
  const [isStripeBannerActive, setIsStripeBannerActive] = useState(true)
  const [isInviteBannerActive, setIsInviteBannerActive] = useState(true)
  const [isProfileBannerActive, setIsProfileBannerActive] = useState(true)
  const [actions, actionsLoaded, _ar] = useDocuments({ userDoc, docs: 'actions', queryConstraints })
  const handleClickOnAction = action => {

  }

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
    setIsProfileBannerActive(!userDoc.profileComplete)
    setIsStripeBannerActive(userDoc.profileComplete && !stripe_redirect_success && !userDoc.stripeVerified)
    setIsInviteBannerActive(userDoc.numInvitesLeft > 0)
  }, [])

  return (
    <div>
      {userDoc.role !== 'company' && isStripeBannerActive && <Banner name='dev-stripe-onboarding' color='bg-yellow-600' text='verify your account to start matching' buttonText='click here' handleClick={() => handleDevStripeOnboarding(userDoc)} handleClose={() => setIsStripeBannerActive(false)} />}
      {isProfileBannerActive && <Banner name='profile-complete' color='bg-red-400' text='your profile is incomplete' buttonText='go to profile' href='/profile' handleClose={() => setIsProfileBannerActive(false)} />}
      {userDoc.role === 'explorer' && isInviteBannerActive && <Banner name='explorer-invites' color='bg-indigo-600' text='you have new gift developer invites!' buttonText='invite a dev!' href='/invites' handleClose={() => setIsInviteBannerActive(false)} />}
      {/* <DashboardActions userDoc={userDoc} setIsPageLoading={setIsPageLoading} {...props} /> */}
      {!actionsLoaded && <SuspensePlaceholders />}
      {actionsLoaded && actions.length === 0 && <EmptyDashboardView />}
      {actionsLoaded && actions.length > 0 && actions.map((a, aix) => <ActionView action={a} key={a.id} handleClickOnAction={handleClickOnAction} />)}

    </div>
  )
}

const EmptyDashboardView = () => {
  return (
    <div className='flex flex-col items-center'>
      <img src='/astronaut.png' className='w-40 mt-4' />
      <h4 className='text-gray-500'>up to date!</h4>
    </div>
  )
}

const ActionView = ({ action, handleClickOnAction, ...props }) => {
  return (
    <div className='group relative' onClick={() => handleClickOnAction(action)}>
        <div className='w-full min-h-20 h-20 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none'>
          <img src={action.photoURL} alt={action.photoURL} className='w-full h-full object-center object-cover lg:w-full lg:h-full' />
        </div>
        <div className='mt-4 flex justify-between items-start'>
          <p className='mt-1 text-sm text-gray-500'>{action.title}</p>
          <p className='text-sm font-medium text-gray-900'>$ {action.salary} </p>
          {action.status === 'good' &&
            <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'> up to date.  </span>}
          {action.status === 'seeking' &&
            <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> review </span>}
        </div>
      </div>
  )
}

export default Dashboard
