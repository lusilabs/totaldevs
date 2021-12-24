import { OfficeBuildingIcon, ShareIcon } from '@heroicons/react/outline'
import Link from 'next/link'

function SignUp () {
  return (
    <div className='flex flex-col md:flex-row m-4 p-8'>
      <h2 className='text-gray-500 font-semibold'>Who are you?</h2>

      <div className='flex flex-col md:flex-row mt-8'>

        <Link href='/signup/company'>

          <div className='flex flex-col text-center items-center max-w-sm p-8 m-4 rounded-lg shadow-lg'>
            <h2 className='text-indigo-400'>Company</h2>
            <OfficeBuildingIcon className='h-36 w-36 text-indigo-400 m-4' />
            <h4 className='text-gray-500'>
              I want to hire local talent.
            </h4>
          </div>

        </Link>

        <Link href='/signup/company'>
          <div className='flex flex-col text-center items-center max-w-sm p-8 m-4 rounded-lg shadow-lg'>
            <h2 className='text-indigo-400'>Explorer</h2>
            <ShareIcon className='h-36 w-36 text-indigo-400 m-4' />
            <h4 className='text-gray-500'>
              I know local talent or companies.
            </h4>
          </div>
        </Link>

      </div>

    </div>
  )
}

export default SignUp
