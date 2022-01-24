import { GoogleAuthProvider, linkWithRedirect, getRedirectResult, signInWithPopup, createUserWithEmailAndPassword, EmailAuthProvider, linkWithCredential, GithubAuthProvider, FacebookAuthProvider } from 'firebase/auth'
import { auth, db, functions, analytics } from '@/utils/config'
import { logEvent } from 'firebase/analytics'
import LoginForm from '@/components/loginform'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { httpsCallable } from 'firebase/functions'
import sleep from '@/utils/misc'

const SUPPORTED_PROVIDERS = { google: GoogleAuthProvider, github: GithubAuthProvider, facebook: FacebookAuthProvider }
const handleUserLogin = httpsCallable(functions, 'handleUserLogin')
function CompleteSignupFlow ({ userDoc, setIsPageLoading, ...props }) {
  const currentUser = auth.currentUser
  const router = useRouter()
  const { convert = false, signup } = router.query
  const handleLinkWithRedirect = provider => {
    const providerInstance = new SUPPORTED_PROVIDERS[provider]()
    setIsPageLoading(true)
    linkWithRedirect(currentUser, providerInstance).then((result) => {
      // Accounts successfully linked this is the callback after the redirect.
      // this never triggers for some reason. I think it only happens on email/pwd login so we have to go with the
      // getRedirectResult route to link this user to a provider.
      // const credential = GoogleAuthProvider.credentialFromResult(result)
      logEvent(analytics, 'handleLinkWithRedirect success')
      setIsPageLoading(false)
    }).catch((error) => {
      logEvent(analytics, 'handleLinkWithRedirect error')
      console.error(error)
    })
  }

  useEffect(() => {
    const handleConvertDevToCompany = async () => {
      if (convert === 'true') {
        setIsPageLoading(true)
        await handleUserLogin({ role: 'company', convert })
        router.push('/')
        setIsPageLoading(false)
      }
    }
    handleConvertDevToCompany()
  }, [convert])

  const handleEmailPasswordLogin = async (email, password) => {
    const credential = EmailAuthProvider.credential(email, password)
    setIsPageLoading(true)
    linkWithCredential(auth.currentUser, credential)
      .then(async (userCredential) => {
        await sleep(3000)
        await handleUserLogin({ role: 'company', convert, email })
        router.push('/jobs?created=true')
        setIsPageLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setIsPageLoading(false)
      })
  }

  return (
    <div className='flex flex-col p-4'>
      <div className='flex items-center justify-center p-4'>
        <img className='w-36 h-36' src='/astronaut.png' />
        <h3 className='font-extrabold tracking-tight text-indigo-600 sm:text-4xl'>
          let's keep in touch.
          &nbsp;
        </h3>
      </div>
      <LoginForm
        handleProviderLogin={handleLinkWithRedirect}
        handleEmailPasswordLogin={handleEmailPasswordLogin}
      />
    </div>
  )
}

export default CompleteSignupFlow
