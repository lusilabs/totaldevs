import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import { auth, db, functions } from '@/utils/config'
import { useRouter } from 'next/router'
import { httpsCallable } from 'firebase/functions'
import sleep from '@/utils/misc'
import LoginForm from '@/components/loginform'
import { useEffect, useState } from 'react'

const handleUserLogin = httpsCallable(functions, 'stripe-handleUserLogin')

export default function Login ({ setIsPageLoading }) {
  const provider = new GoogleAuthProvider()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('dev')
  useEffect(() => {
    const { role = 'dev' } = router.query
    setSelectedRole(role)
  })
  const handleLogin = async () => {
    setIsPageLoading(true)
    const result = await signInWithPopup(auth, provider)
    if (result.user && result.user.uid) {
      await handleUserLogin({ role: selectedRole })
      await sleep(4000)
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
