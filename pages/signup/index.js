import { ShareIcon, OfficeBuildingIcon, UserIcon } from '@heroicons/react/outline'
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

  const handleDevSignUp = async _ => {
    localStorage.removeItem('totalDevsRole')
    router.push('/login')
  }

  return (
    <div className='flex flex-col justify-center items-center m-4 p-4'>

      <h2 className='text-gray-500 font-semibold'>who are you?</h2>

      <div className='flex flex-col md:flex-row m-2'>

        <div className='flex flex-col text-center items-center max-w-sm p-4 m-2 rounded-lg shadow-lg' onClick={() => handleClickOnRole('company')}>
          <h3 className='text-indigo-400'>company</h3>
          <OfficeBuildingIcon className='h-24 w-24 text-indigo-400 m-4' />
          <h4 className='text-gray-500'>
            I want to hire remote talent.
          </h4>
        </div>

        <div className='flex flex-col text-center items-center max-w-sm p-8 m-4 rounded-lg shadow-lg' onClick={() => handleClickOnRole('explorer')}>
          <h3 className='text-indigo-400'>explorer</h3>
          <ShareIcon className='h-24 w-24 text-indigo-400 m-4' />
          <h4 className='text-gray-500'>
            I know talent or companies.
          </h4>
        </div>

        <div className='flex flex-col text-center items-center max-w-sm p-8 m-4 rounded-lg shadow-lg' onClick={handleDevSignUp}>
          <h3 className='text-indigo-400'>dev</h3>
          <UserIcon className='h-24 w-24 text-indigo-400 m-4' />
          <h4 className='text-gray-500'>
            I am a professional developer.
          </h4>
        </div>

      </div>

    </div>
  )
}

export default SignUpFlow
