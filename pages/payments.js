import { functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'
import Banner from '@/components/banner'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SuspensePlaceholders } from '@/components/suspense'
import { query, collection, where, orderBy, limit, getDocs } from '@firebase/firestore'
import { useDocuments } from '@/utils/hooks'
import Status from '@/components/misc/status'

const generateExpressDashboardLink = httpsCallable(functions, 'stripe-generateExpressDashboardLink')
const generateCompanyDashboardLink = httpsCallable(functions, 'stripe-generateCompanyDashboardLink')

const Payments = props => {
  return (
    <>
      {['dev', 'explorer'].includes(props.userDoc.role) && <DevExplorerPayments {...props} />}
      {props.userDoc.role === 'company' && <CompanyPayments {...props} />}
    </>
  )
}

const CompanyPayments = props => {
  const handleNavigateToCompanyDashboard = async matchID => {
    props.setIsPageLoading(true)
    const { data: url } = await generateCompanyDashboardLink({ matchID })
    window.open(url, '_blank')
    props.setIsPageLoading(false)
  }
  const [isLoading, setIsLoading] = useState(true)
  const [subscriptions, subscriptionsLoaded, _sr, _ss] = useDocuments({
    docs: 'subscriptions',
    queryConstraints: [
      where('company', '==', props.userDoc?.uid),
      where('status', 'in', ['paid', 'payment_due', 'payment_failed'])
    ]
  }, [props.userDoc?.uid])

  useEffect(() => {
    setIsLoading(!subscriptionsLoaded)
  }, [subscriptionsLoaded])

  return (
    <div className='max-w-2xl px-4 py-4 mx-auto sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='mt-8 grid grid-cols-2 gap-y-2 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
        {isLoading && <SuspensePlaceholders />}
        {!isLoading && subscriptions?.length > 0 && subscriptions.map((s, ix) => <Subscription key={ix} subscription={s} handleNavigateToCompanyDashboard={handleNavigateToCompanyDashboard} {...props} />)}
        {!isLoading && !subscriptions?.length && <div className='flex flex-col items-center mt-8'> <h4 className='text-center text-indigo-600'>you will see payments here once you have billing job</h4> <img className='w-40 h-40' src='/astronaut.png' /> </div>}
      </div>
    </div>
  )
}

const Subscription = ({ subscription, handleNavigateToCompanyDashboard, ...props }) => {
  return (
    <div className='relative cursor-pointer group' onClick={() => handleNavigateToCompanyDashboard(subscription.match)}>
      <div className='w-full overflow-hidden bg-gray-200 min-h-80 aspect-w-1 aspect-h-1 rounded-md group-hover:opacity-75 lg:h-80 lg:aspect-none hover:z-0'>
        <img src={subscription.photoURL} alt={subscription.photoURL} className='object-cover object-center w-full h-full lg:w-full lg:h-full' />
      </div>
      <div className='flex items-start justify-between mt-4'>
        <p className='mt-1 text-gray-500 text-md'>{subscription.devName}</p>
        <p className='font-medium text-gray-900 text-md'>$ {subscription.finalSalary}</p>
        <Status red={['payment due', 'payment failed']} green={['paid']} value={subscription.status.replace('_', ' ')} />
      </div>
    </div>
  )
}

const DevExplorerPayments = props => {
  const handleNavigateToDevDashboard = async () => {
    props.setIsPageLoading(true)
    const { data: url } = await generateExpressDashboardLink()
    window.open(url, '_blank')
    props.setIsPageLoading(false)
  }
  return (
    <>
      {props.userDoc.isStripeVerified && <Banner color='bg-indigo-600' handleClick={handleNavigateToDevDashboard} buttonText='go to stripe' text='payments are handled by stripe' />}
      <div className='flex flex-col items-center mt-8'>
        {!props.userDoc.isStripeVerified && <h4 className='text-center text-indigo-600'> please verify your account to view your payments </h4>}
        <img className='w-60 h-60' src='/astronaut.png' />
      </div>
    </>
  )
}

export default Payments
