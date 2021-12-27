import { GoogleAuthProvider, linkWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth'
import { Button, Dropdown } from 'semantic-ui-react'
import { auth, db, functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'
import { getAnalytics, logEvent } from 'firebase/analytics'
import { useRouter } from 'next/router'
import sleep from '@/utils/misc'
import LoginForm from '@/components/loginform'
import Link from 'next/link'
import { useEffect } from 'react'

const handleAnonUserConversion = httpsCallable(functions, 'stripe-handleAnonUserConversion')
const handleUserLogin = httpsCallable(functions, 'stripe-handleUserLogin')

function CompleteSignupFlow ({ userDoc, setIsPageLoading, ...props }) {
  const provider = new GoogleAuthProvider()
  const router = useRouter()
  const currentUser = auth.currentUser
  const analytics = getAnalytics()
  console.log('CompleteSignupFlow')
  const handleLinkWithRedirect = () => linkWithRedirect(currentUser, provider).then((result) => {
    // Accounts successfully linked.
    // this never triggers for some reason. so we have to go with the
    // getRedirectResult route to link this user to a provider.
    const credential = GoogleAuthProvider.credentialFromResult(result)
    console.log('handleLinkWithRedirect success', { credential, user: result.user })
  }).catch((error) => {
    logEvent(analytics, 'handleLinkWithRedirect error: ' + JSON.stringify(error))
    console.error(error)
  })

  useEffect(() => {
    const awaitRedirectResults = async () => {
      try {
        console.log('inside awaitRedirectResults')
        const result = await getRedirectResult(auth)
        if (result) {
          const user = result.user
          const userData = JSON.parse(JSON.stringify(user.toJSON()))
          const role = localStorage.getItem('totalDevsRole')
          logEvent(analytics, 'getRedirectResult user converted: role ' + role + ' ' + JSON.stringify(userData))
          console.log({ userData, role })
          await handleAnonUserConversion({ ...userData, role })
          await sleep(2000)
          localStorage.removeItem('totalDevsRole')
          router.push('/')
        }
      } catch (err) {
        logEvent(analytics, 'getRedirectResult error: ' + JSON.stringify(err))
        console.error(err)
      }
    }
    awaitRedirectResults()
  })

  return (
    <div className='flex flex-col p-4'>
      <div className='flex items-center p-4'>
        <img className='w-36 h-36' src='/astronaut.png' />
        <h3 className='font-extrabold tracking-tight text-indigo-600 sm:text-4xl'>
          just one more step...
          &nbsp;
        </h3>
      </div>
      <LoginForm handleLogin={handleLinkWithRedirect} />
    </div>
  )
}

export default CompleteSignupFlow
