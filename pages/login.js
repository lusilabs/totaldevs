import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth'
import { auth, db, functions } from '@/utils/config'
import { useRouter } from 'next/router'
import { httpsCallable } from 'firebase/functions'
import sleep from '@/utils/misc'
import LoginForm from '@/components/loginform'

const handleUserLogin = httpsCallable(functions, 'stripe-handleUserLogin')

export default function Login ({ setIsPageLoading }) {
  const provider = new GoogleAuthProvider()
  const router = useRouter()
  const handleLogin = async () => {
    setIsPageLoading(true)
    const result = await signInWithPopup(auth, provider)
    if (result.user && result.user.uid) {
      await sleep(3000)
      const role = localStorage.getItem('totalDevsRole') ?? 'dev'
      await handleUserLogin({ role })
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
