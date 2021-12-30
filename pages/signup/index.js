import { ShareIcon, TrendingUpIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function SignUpFlow () {
  const router = useRouter()
  const [role, setRole] = useState(null)

  const handleClickOnRole = async role => {
    setRole(role)
    router.push(`/signup/${role}`)
  }

  useEffect(() => {
    localStorage.setItem('totalDevsRole', role)
  }, [role])

  return (
    <div className='flex flex-col justify-center items-center m-4 p-8'>

      <h2 className='text-gray-500 font-semibold'>who are you?</h2>

      <div className='flex mt-8'>

        <div className='flex flex-col text-center items-center max-w-sm p-8 m-4 rounded-lg shadow-lg' onClick={() => handleClickOnRole('company')}>
          <h2 className='text-indigo-400'>company</h2>
          <TrendingUpIcon className='h-36 w-36 text-indigo-400 m-4' />
          <h4 className='text-gray-500'>
            I want to hire remote talent.
          </h4>
        </div>

        <div className='flex flex-col text-center items-center max-w-sm p-8 m-4 rounded-lg shadow-lg' onClick={() => handleClickOnRole('explorer')}>
          <h2 className='text-indigo-400'>explorer</h2>
          <ShareIcon className='h-36 w-36 text-indigo-400 m-4' />
          <h4 className='text-gray-500'>
            I know talent or companies.
          </h4>
        </div>

      </div>

    </div>
  )
}

export default SignUpFlow
