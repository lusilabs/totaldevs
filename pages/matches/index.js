import { JobsToMatch } from '@/components/matches/match'
import Error from 'next/error'

const Matches = ({ userDoc }) => {
  return (
    <>
      {userDoc.role === 'explorer' && (!userDoc.isProfileComplete || !userDoc.isStripeVerified || !userDoc.emailVerified) &&
        <div className='flex flex-col items-center mt-8'>
          <h4 className='text-center text-indigo-600'> complete your account verification to start matching </h4>
          <img className='w-60 h-60' src='/astronaut.png' />
        </div>}
      {userDoc.role === 'explorer' && userDoc.isProfileComplete && userDoc.isStripeVerified && userDoc.emailVerified && <JobsToMatch userDoc={userDoc} />}
      {userDoc.role !== 'explorer' && <Error statusCode={404} />}
    </>
  )
}

export default Matches
