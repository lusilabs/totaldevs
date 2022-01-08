import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import { auth, db, functions } from '@/utils/config'
import { useRouter } from 'next/router'
import { httpsCallable } from 'firebase/functions'
import sleep from '@/utils/misc'
import LoginForm from '@/components/loginform'
import { useEffect, useState } from 'react'

const handleUserLogin = httpsCallable(functions, 'handleUserLogin')

export default function Login ({ setIsPageLoading }) {
  const provider = new GoogleAuthProvider()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('dev')
  const [isConverting, setIsConverting] = useState(false)
  useEffect(() => {
    const { role = 'dev', convert = false } = router.query
    setSelectedRole(role)
    setIsConverting(convert)
  })
  const handleLogin = async () => {
    setIsPageLoading(true)
    const result = await signInWithPopup(auth, provider)
    if (result.user && result.user.uid) {
      await sleep(3000)// give time to firestore for the userDoc to be populated
      await handleUserLogin({ role: selectedRole, convert: isConverting })
      router.push('/')
    }
    setIsPageLoading(false)
  }
  return (
    <main>
      <section className='absolute w-full h-full'>
        <div
          className='absolute top-0 w-full h-full '
        >
          <LoginForm allowRecovery handleLogin={handleLogin} />
        </div>
      </section>
    </main>
  )
}
