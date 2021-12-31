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
    <>
      {props.userDoc.verified && <Banner color='bg-indigo-600' handleClick={handleNavigateToDashboard} buttonText='go to stripe' text='payments are handled by stripe' />}
      <div className='flex flex-col items-center mt-8'>
        {!props.userDoc.verified && <h4 className='text-indigo-600 text-center'> please verify your account to view your payments </h4>}
        <img className='w-60 h-60' src='/astronaut.png' />
      </div>
    </>
  )
}

export default Payments
