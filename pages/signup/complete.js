import { GoogleAuthProvider, linkWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth'
import { auth, db, functions, analytics } from '@/utils/config'
import { logEvent } from 'firebase/analytics'
import LoginForm from '@/components/loginform'

function CompleteSignupFlow ({ userDoc, setIsPageLoading, ...props }) {
  const provider = new GoogleAuthProvider()
  const currentUser = auth.currentUser
  const handleLinkWithRedirect = () => {
    setIsPageLoading(true)
    linkWithRedirect(currentUser, provider).then((result) => {
      // Accounts successfully linked.
      // this never triggers for some reason. I think it only happens on email/pwd login so we have to go with the
      // getRedirectResult route to link this user to a provider.
      const credential = GoogleAuthProvider.credentialFromResult(result)
      logEvent(analytics, 'handleLinkWithRedirect success')
      setIsPageLoading(false)
    }).catch((error) => {
      logEvent(analytics, 'handleLinkWithRedirect error: ' + JSON.stringify(error))
      console.error(error)
    })
  }

  return (
    <div className='flex flex-col p-4'>
      <div className='flex items-center justify-center p-4'>
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
