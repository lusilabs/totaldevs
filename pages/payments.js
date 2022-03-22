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
    window.location.assign(url)
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
    <div className='max-w-2xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='mt-8 grid grid-cols-2 gap-y-2 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
        {isLoading && <SuspensePlaceholders />}
        {!isLoading && matches && matches.length > 0 && matches.map((m, ix) => <Match key={ix} match={m} handleNavigateToCompanyDashboard={handleNavigateToCompanyDashboard} {...props} />)}
        {!isLoading && matches && matches.length === 0 && <div className='text-md text-gray-600'>no matches yet.</div>}
      </div>
    </div>
  )
}

const Match = ({ match, handleNavigateToCompanyDashboard, ...props }) => {
  return (
    <div className='group relative cursor-pointer' onClick={() => handleNavigateToCompanyDashboard(match.id)}>
      <div className='w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none hover:z-0'>
        <img src={match.photoURL} alt={match.photoURL} className='w-full h-full object-center object-cover lg:w-full lg:h-full' />
      </div>
      <div className='mt-4 flex justify-between items-start'>
        <p className='mt-1 text-md text-gray-500'>{match.devName}</p>
        <p className='text-md font-medium text-gray-900'>$ {match.jobData?.finalSalary}</p>
        {match.status === 'locked' && <span className='px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-green-100 text-green-800'> up to date.  </span>}
        {match.status !== 'payment_due' && <span className='px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-red-100 text-red-800'> payment due </span>}
      </div>
    </div>
  )
}

const DevExplorerPayments = props => {
  const handleNavigateToDevDashboard = async () => {
    props.setIsPageLoading(true)
    const { data: url } = await generateExpressDashboardLink()
    window.location.assign(url)
  }
  return (
    <>
      {props.userDoc.isStripeVerified && <Banner color='bg-indigo-600' handleClick={handleNavigateToDevDashboard} buttonText='go to stripe' text='payments are handled by stripe' />}
      <div className='flex flex-col items-center mt-8'>
        {!props.userDoc.isStripeVerified && <h4 className='text-indigo-600 text-center'> please verify your account to view your payments </h4>}
        <img className='w-60 h-60' src='/astronaut.png' />
      </div>
    </>
  )
}

export default Payments
