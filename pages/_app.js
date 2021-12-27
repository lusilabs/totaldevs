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
import { signInAnonymously } from 'firebase/auth'
import Router, { useRouter } from 'next/router'
import NProgress from 'nprogress'
import Layout from '@/components/layout'
import { signOut } from '@firebase/auth'
import Landing from '@/components/landing'
import Spinner from '@/components/spinner'
import InvitationRequired from './invitationRequired'

Router.events.on('routeChangeStart', NProgress.start)
Router.events.on('routeChangeComplete', NProgress.done)
Router.events.on('routeChangeError', NProgress.done)
NProgress.configure({ showSpinner: false })

const anonRoutes = [
  '/login'
]

const pageNavigationByRole = {
  dev: [
    { name: 'projects', href: '/projects', current: false },
    { name: 'content', href: '/content', current: false }
  ],
  company: [
    { name: 'jobs', href: '/jobs', current: false }
  ],
  explorer: [
    { name: 'jobs', href: '/jobs', current: false }
  ]

}

const userNavigationByRole = {
  dev: [
    { name: 'profile', href: '/profile' },
    { name: 'invites', href: '/invites' },
    { name: 'logout', href: '/', handleClick: () => signOut(auth) }
  ],
  company: [
    { name: 'profile', href: '/profile' },
    { name: 'logout', href: '/', handleClick: () => signOut(auth) }
  ],
  explorer: [
    { name: 'profile', href: '/profile' },
    { name: 'logout', href: '/', handleClick: () => signOut(auth) }
  ]
}

const anonNavigation = []
const anonUserNavigation = [
  { name: 'logout', href: '/', handleClick: () => signOut(auth) }
]

function MyApp ({ Component, pageProps }) {
  const [user, isUserLoading, error] = useAuthState(auth)
  const [userDoc, setUserDoc] = useState()
  const [navigation, setNavigation] = useState(anonNavigation)
  const [userNavigation, setUserNavigation] = useState(anonUserNavigation)
  const router = useRouter()
  const onAnonRoutes = anonRoutes.includes(router.pathname)
  const [isPageLoading, setIsPageLoading] = useState(false)

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
    console.log({ user, userDoc, Component })
    if (userDoc && userDoc.role) {
      setNavigation(pageNavigationByRole[userDoc.role])
      setUserNavigation(userNavigationByRole[userDoc.role])
    }
  })

  const handleWorkWithUs = async () => {
    // sign in as Anon, at the end of the flow we prompt for optional login.
    setIsPageLoading(true)
    await signInAnonymously(auth)
    router.push('/signup')
    setIsPageLoading(false)
  }

  if (user && userDoc && userDoc.role === 'dev' && !userDoc.wasInvited) {
    return <InvitationRequired userDoc={userDoc} {...pageProps} />
  }
  return (
    <>
      <Head>
        <script type='text/javascript' src='/tawk.js' />
        <link rel='icon' href='/public/logo-small.png' />
        <meta name='totaldevs' content='&nbsp;' />
        <title>totaldevs</title>
      </Head>
      {(isUserLoading || isPageLoading) && <Spinner />}
      {error && <Error title='Error while retrieving user' statusCode={500} />}
      {!user && !isUserLoading && !onAnonRoutes && <Landing setIsPageLoading={setIsPageLoading} handleWorkWithUs={handleWorkWithUs} />}
      {user && userDoc && !onAnonRoutes &&
        <Layout user={user} userDoc={userDoc} navigation={navigation} userNavigation={userNavigation} {...pageProps}>
          <Component user={user} userDoc={userDoc} setIsPageLoading={setIsPageLoading} {...pageProps} />
          <ToastContainer />
        </Layout>}
      {onAnonRoutes &&
        <>
          <Component user={user} userDoc={userDoc} setIsPageLoading={setIsPageLoading} {...pageProps} />
          <ToastContainer />
        </>}
    </>
  )
}

export default MyApp
