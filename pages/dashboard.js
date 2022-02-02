import Banner from '@/components/banner'
import { auth, db, functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDocuments } from '@/utils/hooks'
import { getDoc, setDoc, getDocs, collection, doc, query, limit, where, orderBy } from '@firebase/firestore'
import { SuspensePlaceholders } from '@/components/suspense'
import Link from 'next/link'
import { InformationCircleIcon, ArrowNarrowRightIcon } from '@heroicons/react/outline'
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
    // const aref = doc(db, 'actions', action.id)
    // setDoc(aref, { seen: true }, { merge: true })
    router.push(action.url)
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
      {/* {actionsLoaded && actions.length > 0 && actions.map((a, aix) => <ActionView action={a} key={a.id} handleClickOnAction={handleClickOnAction} />)} */}
      {actionsLoaded && actions.length > 0 && <ActionView actions={actions} handleClickOnAction={handleClickOnAction} />}
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

const ActionView = ({ actions, handleClickOnAction }) => {
  return (
    <div class='w-10/12 md:w-7/12 lg:6/12 mx-auto relative py-6'>
      <h1 class='text-lg text-center font-bold text-indigo-400'>notifications</h1>
      <div class='border-l-2 mt-6'>
        {actions.map((a, aix) => <ActionCard action={a} key={aix} />)}
      </div>
    </div>
  )
}

const ActionCard = ({ action, handleClickOnAction }) => {
  const textColor = `text-${action.color}-700` || 'text-yellow-800'
  const cardColor = `bg-${action.color}-200` || 'bg-yellow-200'
  const iconColor = `bg-${action.color}-400` || 'bg-yellow-400'
  return (
    <div className={'transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-4 py-2 rounded mb-8 flex-col md:flex-row space-y-4 md:space-y-0 ' + cardColor} onClick={() => handleClickOnAction(action)}>

      <div className='w-5 h-5  absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0'>
        {action.icon === 'times' && <i className={'fas fa-times-circle fa-lg ' + textColor} />}
        {(action.icon === 'warning' || action.icon === 'alert') && <i className={'fas fa-exclamation-triangle fa-lg ' + textColor} />}
        {action.icon === 'check' && <i className={'fas fa-check-square fa-lg ' + textColor} />}
        {(action.icon === 'info' || !action.icon) && <i className={'fas fa-info-circle fa-lg ' + textColor} />}
      </div>

      <div className={'w-8 h-1 absolute -left-8 z-0 ' + cardColor} />

      <div className='flex justify-evenly min-w-full'>
        <p className={'text-sm font-bold ' + textColor}>{action.text}</p>
        <i className={'fas fa-sign-in-alt fa-lg ' + textColor} />
      </div>
    </div>
  )
}

// const ActionView = ({ action, handleClickOnAction, ...props }) => {
//   return (

//     <section className='px-0 py-12 mx-auto max-w-7xl sm:px-4 hover:-translate-y-2' onClick={() => handleClickOnAction(action)}>
//       <div className='flex rounded-md bg-gradient-to-b from-red-100 to-red-300 text-red-700'>
//         {/* <img src={action.photoURL} alt={action.photoURL} className='w-12 h-12 rounded-full' /> */}
//         <InformationCircleIcon className='h-4' />
//         <div className='flex flex-col items-center justify-between px-1 py-4 lg:flex-row sm:py-3 sm:px-3'>
//           <p className='mb-6 text-base font-semibold lg:mb-0 overflow-hidden'>{action.text}</p>
//           <p className='text-red-800'>{action.buttonText}</p>
//           <ArrowNarrowRightIcon className='h-4' />
//         </div>
//       </div>
//     </section>

//   )
// }

export default Dashboard
