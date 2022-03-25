import { useEffect } from 'react'
import { functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'
import EditButton from '@/components/editbutton'

const checkStripeAccountStanding = httpsCallable(functions, 'stripe-checkStripeAccountStanding')
const generateOnboardingURL = httpsCallable(functions, 'stripe-generateOnboardingURL')

export default function DevProfileDisplay ({ userDoc, setIsEditing, readOnly, setIsPageLoading }) {
  useEffect(() => {
    checkStripeAccountStanding()
  }, [])

  const handleDevStripeOnboarding = async () => {
    setIsPageLoading(true)
    const { data: url } = await generateOnboardingURL(userDoc)
    setIsPageLoading(false)
    window.location.assign(url)
  }

  return (
    <>
      <div className='bg-white shadow-md overflow-hidden sm:rounded-lg m-4'>
        <div className='px-4 py-2 sm:px-6'>
          <div className='flex flex-row justify-between items-center'>
            <img className='h-12 w-12 rounded-full' src={userDoc.photoURL} />
            <div className='flex flex-col'>
              <div className='text-sm font-medium text-gray-500'>{userDoc.displayName}</div>
              <div className='text-sm font-medium text-gray-500'>{userDoc.email}</div>
            </div>
            {!readOnly &&
              <>
                <div>
                  {/* profile standing */}
                  {userDoc.isProfileComplete && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'> complete </span>}
                  {!userDoc.isProfileComplete && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> incomplete </span>}
                </div>
              </>}
          </div>
        </div>

        <dl>
          <div className='bg-gray-50 px-4 py-5 flex justify-between items-center'>
            <div className='flex items-center'>
              <i className='fa fa-credit-card' aria-hidden='true' />
              <dt className='ml-4 text-lg font-medium text-gray-500'>payments</dt>
            </div>
            {userDoc.isStripeVerified && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'> verified </span>}
            {!userDoc.isStripeVerified && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> verify now </span>}

            <EditButton setIsEditing={handleDevStripeOnboarding} />
          </div>

          <div className=' px-4 py-5 flex justify-between items-center'>
            <div className='flex items-center'>
              <i className='fa fa-calendar' aria-hidden='true' />
              <dt className='ml-4 text-lg font-medium text-gray-500'>preferences and availability</dt>
            </div>
            <div className='flex items-center'>
              {!userDoc.isAvailabilityComplete && <i className='mr-4 fa fa-exclamation-triangle text-yellow-300' aria-hidden='true' />}
              {userDoc.isAvailabilityComplete && <i className='mr-4 fa fa-check-circle text-green-300' aria-hidden='true' />}
              <EditButton setIsEditing={() => setIsEditing('availability')} />
            </div>
          </div>

        </dl>

      </div>

      <div className='bg-white shadow-md overflow-hidden sm:rounded-lg m-4'>
        <div className='border-t border-gray-200'>
          <dl>

            <div className='bg-gray-50 px-4 py-5 flex justify-between items-center'>
              <div className='flex items-center'>
                <i className='fa fa-address-card' aria-hidden='true' />
                <dt className='ml-4 text-lg font-medium text-gray-500'>about</dt>
              </div>
              <div className='justify-between items-center'>
                {!userDoc.isAboutMeComplete && <i className='mr-4 fa fa-exclamation-triangle text-yellow-300' aria-hidden='true' />}
                {userDoc.isAboutMeComplete && <i className='mr-4 fa fa-check-circle text-green-300' aria-hidden='true' />}
                <EditButton setIsEditing={() => setIsEditing('about')} />
              </div>
            </div>

            <div className='px-4 py-5 flex justify-between items-center'>
              <div className='flex items-center'>
                <i className='fa fa-industry' aria-hidden='true' />
                <dt className='ml-4 text-lg font-medium text-gray-500'>experience</dt>
              </div>
              <div className='justify-between items-center'>
                {!userDoc.isExperienceComplete && <i className='mr-4 fa fa-exclamation-triangle text-yellow-300' aria-hidden='true' />}
                {userDoc.isExperienceComplete && <i className='mr-4 fa fa-check-circle text-green-300' aria-hidden='true' />}
                <EditButton setIsEditing={() => setIsEditing('experience')} />
              </div>
            </div>

            <div className='bg-gray-50 px-4 py-5 flex justify-between items-center'>
              <div className='flex items-center'>
                <i className='fa fa-briefcase' aria-hidden='true' />

                <dt className='ml-4 text-lg font-medium text-gray-500'>projects</dt>
              </div>
              <div className='justify-between items-center'>
                {!userDoc.isProjectsComplete && <i className='mr-4 fa fa-exclamation-triangle text-yellow-300' aria-hidden='true' />}
                {userDoc.isProjectsComplete && <i className='mr-4 fa fa-check-circle text-green-300' aria-hidden='true' />}
                <EditButton setIsEditing={() => setIsEditing('projects')} />
              </div>
            </div>

            <div className='px-4 py-5 flex justify-between items-center'>
              <div className='flex items-center'>
                <i className='fa fa-graduation-cap' aria-hidden='true' />

                <dt className='ml-4 text-lg font-medium text-gray-500'>education</dt>
              </div>
              <div className='justify-between items-center'>
                {!userDoc.isEducationComplete && <i className='mr-4 fa fa-exclamation-triangle text-yellow-300' aria-hidden='true' />}
                {userDoc.isEducationComplete && <i className='mr-4 fa fa-check-circle text-green-300' aria-hidden='true' />}
                <EditButton setIsEditing={() => setIsEditing('education')} />
              </div>
            </div>

          </dl>
        </div>
      </div>
    </>
  )
}
