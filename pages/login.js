import { GoogleAuthProvider, signInWithPopup, GithubAuthProvider, FacebookAuthProvider } from '@firebase/auth'
import { auth, functions } from '@/utils/config'
import { useRouter } from 'next/router'
import { httpsCallable } from 'firebase/functions'
import sleep from '@/utils/misc'
import LoginForm from '@/components/loginform'
import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, updatePassword } from 'firebase/auth'
import { toast } from 'react-toastify'

const handleUserLogin = httpsCallable(functions, 'handleUserLogin')

const SUPPORTED_PROVIDERS = { google: GoogleAuthProvider, github: GithubAuthProvider, facebook: FacebookAuthProvider }

export default function Login ({ setIsPageLoading }) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('dev')
  const [isConverting, setIsConverting] = useState(false)
  const [allowRecovery, setIsAllowRecovery] = useState(true)
  useEffect(() => {
    const { role = 'dev', convert = false } = router.query
    setSelectedRole(role)
    setIsConverting(convert)
    setIsAllowRecovery(!router.asPath.includes('role')) // if there is a role we are on the signup, shouldn't need a recovery code.
  })
  const handleProviderLogin = async provider => {
    const providerInstance = new SUPPORTED_PROVIDERS[provider]()
    setIsPageLoading(true)
    try {
      const result = await signInWithPopup(auth, providerInstance)
      if (result.user && result.user.uid) {
        await sleep(3000)// give time to firestore for the userDoc to be populated
        console.log({selectedRole})
        await handleUserLogin({ role: selectedRole, converted: isConverting })
        router.push('/')
      }
    } catch (err) {
      console.error(err)
      if (err.code === 'auth/account-exists-with-different-credential') {
        toast.error('An account already exists with that email, try logging in with another provider')
      } else {
        toast.error(err.code)
      }
    }
    setIsPageLoading(false)
  }

  const handleEmailPasswordLogin = async (email, password) => {
    setIsPageLoading(true)
    if (allowRecovery) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        await handleUserLogin({ email })
        router.push('/')
        setIsPageLoading(false)
      } catch (e) {
        console.error(e)
        toast.error(e.code)
        setIsPageLoading(false)
      }
    } else {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // const userData = JSON.parse(JSON.stringify(user.toJSON()))
        await sleep(3000)
        await handleUserLogin({ role: selectedRole, converted: isConverting, email })
        router.push('/')
        setIsPageLoading(false)
      } catch (e) {
        console.error(e)
        toast.error(e.code)
        setIsPageLoading(false)
      }
    }
  }

  // const handleForgotPassword = async () => {
  //   const user = auth.currentUser
  //   const newPassword = Math.random().toString(36).slice(-8)

  //   try {
  //     const success = await updatePassword(user, newPassword)
  //     if (success) {
  //       await sendPasswordResetEmail()
  //       toast.success('A new password has been sent to your email')
  //     }
  //   } catch (e) {
  //     console.error(e)
  //     toast.error(e.code)
  //   }
  // }
  return (
    <main>
      <section className='absolute w-full h-full'>
        <div
          className='absolute top-0 w-full h-full '
        >
          <LoginForm
            allowRecovery={allowRecovery}
            role={selectedRole}
            handleProviderLogin={handleProviderLogin}
            handleEmailPasswordLogin={handleEmailPasswordLogin}
            // handleForgotPassword={handleForgotPassword}
          />
        </div>
      </section>
    </main>
  )
}
