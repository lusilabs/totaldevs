import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import { auth, db, functions } from '@/utils/config'
import { useRouter } from 'next/router'
import { httpsCallable } from 'firebase/functions'
import sleep from '@/utils/misc'
import LoginForm from '@/components/loginform'
import { useEffect } from 'react'
import Banner from '@/components/banner'

const generateExpressDashboardLink = httpsCallable(functions, 'stripe-generateExpressDashboardLink')

function Payments (props) {
  const handleNavigateToDashboard = async () => {
    props.setIsPageLoading(true)
    const { data: url } = await generateExpressDashboardLink()
    window.location.assign(url)
  }
  return (
    <div className='flex flex-col'>
      <Banner color='bg-indigo-600' handleClick={handleNavigateToDashboard} buttonText='go to stripe' text='payments are handled by stripe' />
      <img className='p-24' src='/astronaut.png' />
    </div>
  )
}

export default Payments
