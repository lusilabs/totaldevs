import { functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'
import Banner from '@/components/banner'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SuspensePlaceholders } from '@/components/suspense'
import { query, collection, where, orderBy, limit, getDocs } from '@firebase/firestore'
import { useDocuments } from '@/utils/hooks'

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
  }
  const [isLoading, setIsLoading] = useState(true)
  const [matches, matchesLoaded, _mr, _sm] = useDocuments({
    docs: 'matches',
    queryConstraints: [
      where('company', '==', props.userDoc?.uid)
      // where('status', 'in', ['locked'])
    ]
  }, [props.userDoc?.uid])

  useEffect(() => {
    setIsLoading(!matchesLoaded)
  }, [matchesLoaded])

  return (
    <div className='max-w-2xl px-4 py-4 mx-auto sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='mt-8 grid grid-cols-2 gap-y-2 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
        {isLoading && <SuspensePlaceholders />}
        {!isLoading && matches && matches.length > 0 && matches.map((m, ix) => <Match key={ix} match={m} handleNavigateToCompanyDashboard={handleNavigateToCompanyDashboard} {...props} />)}
        {!isLoading && matches && matches.length === 0 && <div className='flex flex-col items-center mt-8'> <h4 className='text-center text-indigo-600'>you will see payments here once you have job matches</h4> <img className='w-40 h-40' src='/astronaut.png' /> </div>}
      </div>
    </div>
  )
}

const Match = ({ match, handleNavigateToCompanyDashboard, ...props }) => {
  return (
    <div className='relative cursor-pointer group' onClick={() => handleNavigateToCompanyDashboard(match.id)}>
      <div className='w-full overflow-hidden bg-gray-200 min-h-80 aspect-w-1 aspect-h-1 rounded-md group-hover:opacity-75 lg:h-80 lg:aspect-none hover:z-0'>
        <img src={match.photoURL} alt={match.photoURL} className='object-cover object-center w-full h-full lg:w-full lg:h-full' />
      </div>
      <div className='flex items-start justify-between mt-4'>
        <p className='mt-1 text-gray-500 text-md'>{match.devName}</p>
        <p className='font-medium text-gray-900 text-md'>$ {match.jobData?.finalSalary}</p>
        {match.status === 'locked' && <span className='inline-flex px-2 font-semibold text-green-800 bg-green-100 rounded-full text-md leading-5'> up to date.  </span>}
        {match.status !== 'payment_due' && <span className='inline-flex px-2 font-semibold text-red-800 bg-red-100 rounded-full text-md leading-5'> payment due </span>}
      </div>
    </div>
  )
}

const DevExplorerPayments = props => {
  const handleNavigateToDevDashboard = async () => {
    props.setIsPageLoading(true)
    const { data: url } = await generateExpressDashboardLink()
    window.open(url, '_blank')
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
