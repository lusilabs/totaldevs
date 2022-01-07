import { signOut } from '@firebase/auth'
import { auth, db, functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'

const convertToExplorer = httpsCallable(functions, 'stripe-handleConvertToExplorer')

function InvitationRequired ({ setIsPageLoading }) {
  const handleConvertToExplorer = async () => {
    setIsPageLoading(true)
    await convertToExplorer()
    setIsPageLoading(false)
  }
  return (
    <>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between'>
        <img src='/astronaut.png' />
        <h2 className='font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
          <span className='block'>Exclusive content</span>
          <span className='block text-indigo-600 text-2xl'>
            You cannot access the content a this time, an invitation from another dev is required.
          </span>
          <span className='text-lg'>
            if you just recently got an invitation, try signing in again to redeem it.
          </span>
        </h2>
        <div className='mt-8 lg:mt-0 lg:flex-shrink-0'>
          <div className='inline-flex rounded-md'>
            <button
              className='bg-yellow-600 text-white hover:bg-gray-700 text-xl font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 mt-12'
              onClick={() => signOut(auth)}
            >Sign out
              <i className='fas fa-arrow-alt-circle-right' />
            </button>
            <button
              className='bg-indigo-800 text-white hover:bg-gray-700 text-xl font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 mt-12'
              onClick={handleConvertToExplorer}
            >I'm an explorer
              <i className='fas fa-arrow-alt-circle-up' />
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default InvitationRequired
