import { ShareIcon, OfficeBuildingIcon, UserIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function SignUpFlow ({ handleCreateJobPosting, ...props }) {
  const router = useRouter()

  useEffect(() => {
    const { convert = false, signup } = router.query
    if (convert) toast.success('job posted successfully!')
  }, [])

  const handleClickOnRole = async role => {
    router.push(`/login?role=${role}&convert=${convert}`)
  }

  return (
    <div className='flex flex-col justify-center items-center m-4 p-4'>

      <h2 className='text-gray-500 font-semibold'>who are you?</h2>

      <div className='flex flex-col md:flex-row m-2'>

        {!convert &&
          <div className='flex flex-col cursor-pointer text-center items-center max-w-sm p-8 m-4 rounded-lg shadow-lg' onClick={() => handleClickOnRole('dev')}>
            <h3 className='text-indigo-400'>dev</h3>
            <UserIcon className='h-24 w-24 text-indigo-400 m-4' />
            <h4 className='text-gray-500'>
              I am a professional developer.
            </h4>
          </div>}

        <div className='flex flex-col text-center items-center cursor-pointer max-w-sm p-8 m-4 rounded-lg shadow-lg' onClick={() => handleClickOnRole('explorer')}>
          <h3 className='text-indigo-400'>explorer</h3>
          <ShareIcon className='h-24 w-24 text-indigo-400 m-4' />
          <h4 className='text-gray-500'>
            I know talent or companies.
          </h4>
        </div>

        <div className='flex flex-col text-center items-center cursor-pointer max-w-sm p-8 m-4 rounded-lg shadow-lg' onClick={() => handleCreateJobPosting({ convert })}>
          <h3 className='text-indigo-400'>company</h3>
          <OfficeBuildingIcon className='h-24 w-24 text-indigo-400 m-4' />
          <h4 className='text-gray-500'>
            I want to hire remote talent.
          </h4>
        </div>

      </div>

    </div>
  )
}

export default SignUpFlow
