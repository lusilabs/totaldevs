import 'tailwindcss/tailwind.css'
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css'
import 'nprogress/nprogress.css'
import { auth, db } from '@/utils/config'
import Head from 'next/head'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { ToastContainer } from 'react-toastify'
import Router, { useRouter } from 'next/router'
import NProgress from 'nprogress'
import Layout from '@/components/layout'
import { signOut } from '@firebase/auth'
import Landing from './index'
import Spinner from '@/components/spinner'
import InvitationRequired from './invitationRequired'

Router.events.on('routeChangeStart', NProgress.start)
Router.events.on('routeChangeComplete', NProgress.done)
Router.events.on('routeChangeError', NProgress.done)
NProgress.configure({ showSpinner: false })

const anonRoutes = [
  '/login',
  '/signup'
]

const devNavigation = [
  { name: 'projects', href: '/projects', current: false },
  { name: 'content', href: '/content', current: false }
]

const userNavigation = [
  { name: 'profile', href: '/profile' },
  { name: 'invites', href: '/invites' },
  { name: 'logout', href: '/', handleClick: () => signOut(auth) }
]

function MyApp ({ Component, pageProps }) {
  const [user, isLoading, error] = useAuthState(auth)
  const [userDoc, setUserDoc] = useState()
  const [navigation, setNavigation] = useState([])
  const router = useRouter()
  const onAnonRoutes = anonRoutes.includes(router.pathname)

  useEffect(() => {
    let unsubscribe = () => {}
    if (user && user.uid) {
      const ref = doc(db, 'users', user.uid)
      unsubscribe = onSnapshot(ref, doc => {
        if (doc.exists) {
          const userData = doc.data()
          setUserDoc(userData)
        }
      })
    }
    return unsubscribe
  }, [user])

  useEffect(() => {
    if (userDoc && userDoc.isDev) setNavigation(devNavigation)
  })

  console.log({ Component, user, userDoc })

  return (
    <>
      <Head>
        <script type='text/javascript' src='tawk.js' />
        <link rel='icon' href='logo-small.png' />
        <meta name='totaldevs' content='&nbsp;' />
        <title>totaldevs</title>
      </Head>
      {isLoading && <Spinner />}
      {error && <Error title='Error while retrieving user' statusCode={500} />}
      {!user && !isLoading && !onAnonRoutes && <Landing />}
      {user && userDoc && !userDoc.wasInvited && <InvitationRequired userDoc={userDoc} {...pageProps} />}
      {user && userDoc && userDoc.wasInvited && !onAnonRoutes &&
        <Layout user={user} userDoc={userDoc} navigation={navigation} userNavigation={userNavigation} {...pageProps}>
          <Component user={user} userDoc={userDoc} userError={error} {...pageProps} />
          <ToastContainer />
        </Layout>}
      {onAnonRoutes &&
        <>
          <Component user={user} userDoc={userDoc} userError={error} {...pageProps} />
          <ToastContainer />
        </>}
    </>
  )
}

export default MyApp
