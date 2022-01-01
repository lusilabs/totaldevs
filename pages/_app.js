import 'tailwindcss/tailwind.css'
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css'
import 'nprogress/nprogress.css'
import { auth, db, functions, analytics } from '@/utils/config'
import Head from 'next/head'
import { useAuthState } from 'react-firebase-hooks/auth'
import { httpsCallable } from 'firebase/functions'
import { useState, useEffect } from 'react'
import { doc, onSnapshot, where, orderBy, limit, query, collection, getDocs } from 'firebase/firestore'
import { ToastContainer } from 'react-toastify'
import { signInAnonymously, getRedirectResult } from 'firebase/auth'
import Router, { useRouter } from 'next/router'
import NProgress from 'nprogress'
import Layout from '@/components/layout'
import { signOut } from '@firebase/auth'
import Landing from '@/components/landing'
import Spinner from '@/components/spinner'
import InvitationRequired from './invitationRequired'
import sleep from '@/utils/misc'
import { logEvent } from 'firebase/analytics'

Router.events.on('routeChangeStart', NProgress.start)
Router.events.on('routeChangeComplete', NProgress.done)
Router.events.on('routeChangeError', NProgress.done)
NProgress.configure({ showSpinner: false })

const anonRoutes = [
  '/login',
  '/signup/company',
  '/signup/explorer',
  '/signup/complete',
  '/signup',
  '/terms',
  '/privacy'
]

const pageNavigationByRole = {
  dev: [
    { name: 'projects', href: '/projects', current: false },
    { name: 'content', href: '/content', current: false },
    { name: 'payments', href: '/payments', current: false }
  ],
  company: [
    { name: 'jobs', href: '/jobs', current: false }
  ],
  explorer: [
    { name: 'matches', href: '/matches', current: false },
    { name: 'payments', href: '/payments', current: false }
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
    { name: 'invites', href: '/invites' },
    { name: 'logout', href: '/', handleClick: () => signOut(auth) }
  ]
}

const adminNavigation = [
  { name: 'devs', href: '/admin/devs' },
  { name: 'exs', href: '/admin/explorers' },
  { name: 'comps', href: '/admin/companies' }

]

const adminUserNavigation = [
  { name: 'success', href: '/admin/success' }
]

const anonNavigation = []
const anonUserNavigation = [
  { name: 'logout', href: '/', handleClick: () => signOut(auth) }
]

const handleAnonUserConversion = httpsCallable(functions, 'stripe-handleAnonUserConversion')

function MyApp ({ Component, pageProps }) {
  const [user, isUserLoading, error] = useAuthState(auth)
  const [userDoc, setUserDoc] = useState()
  const [navigation, setNavigation] = useState(anonNavigation)
  const [userNavigation, setUserNavigation] = useState(anonUserNavigation)
  const router = useRouter()
  const onAnonRoutes = anonRoutes.includes(router.pathname)
  const onAdminRoutes = router.pathname.includes('admin')
  const [isPageLoading, setIsPageLoading] = useState(false)
  const [profiles, setProfiles] = useState([])

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
    const retrievePublicProfiles = async () => {
      const q = query(
        collection(db, 'profiles'),
        where('visibility', '==', 'public'),
        where('stack', '!=', []),
        // where('rating', '>', 3),
        // orderBy('rating'),
        limit(20)
      )
      const querySnapshot = await getDocs(q)
      const snaps = []
      querySnapshot.forEach(doc => {
        snaps.push({ id: doc.id, ...doc.data() })
      })
      setProfiles(snaps)
    }
    retrievePublicProfiles()
  }, [])

  useEffect(() => {
    // console.log({ user, userDoc, Component })
    if (userDoc && userDoc.role) {
      let nav = pageNavigationByRole[userDoc.role]
      let userNav = userNavigationByRole[userDoc.role]
      if (userDoc.isAdmin) {
        nav = [...nav, ...adminNavigation]
        userNav = [...userNav, ...adminUserNavigation]
      }
      setNavigation(nav)
      setUserNavigation(userNav)
    }
  }, [userDoc])

  const handleWorkWithUs = async () => {
    // sign in as Anon, at the end of the flow we prompt for optional login.
    setIsPageLoading(true)
    await signInAnonymously(auth)
    router.push('/signup')
    logEvent(analytics, 'signing up')
    setIsPageLoading(false)
  }
  useEffect(() => {
    const awaitRedirectResults = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          setIsPageLoading(true)
          const user = result.user
          const userData = JSON.parse(JSON.stringify(user.toJSON()))
          const role = localStorage.getItem('totalDevsRole')
          logEvent(analytics, 'getRedirectResult user converted: role ' + role + ' ' + JSON.stringify(userData))
          console.log({ userData, role })
          await handleAnonUserConversion({ ...userData, role })
          await sleep(2000)
          localStorage.removeItem('totalDevsRole')
          setIsPageLoading(false)
          router.push('/')
        }
      } catch (err) {
        logEvent(analytics, 'getRedirectResult error: ' + JSON.stringify(err))
        console.error(err)
        setIsPageLoading(false)
      }
    }
    awaitRedirectResults()
  }, [userDoc])

  if (user && userDoc && userDoc.role === 'dev' && !userDoc.hasAcceptedInvite) {
    return <InvitationRequired userDoc={userDoc} {...pageProps} />
  }
  if (onAdminRoutes && !userDoc?.isAdmin) return null

  return (
    <>

      {(isUserLoading || isPageLoading) && <Spinner />}
      {error && <Error title='Error while retrieving user' statusCode={500} />}
      {!user && !isUserLoading && !onAnonRoutes && <Landing profiles={profiles} setIsPageLoading={setIsPageLoading} handleWorkWithUs={handleWorkWithUs} />}
      {user && userDoc && !onAnonRoutes &&
        <Layout user={user} userDoc={userDoc} navigation={navigation} userNavigation={userNavigation} {...pageProps}>
          <Component user={user} userDoc={userDoc} setIsPageLoading={setIsPageLoading} {...pageProps} />
          <ToastContainer pauseOnFocusLoss={false} autoClose={2000} />
        </Layout>}
      {onAnonRoutes &&
        <>
          <Component user={user} userDoc={userDoc} setIsPageLoading={setIsPageLoading} {...pageProps} />
          <ToastContainer pauseOnFocusLoss={false} autoClose={2000} />
        </>}
    </>
  )
}

export default MyApp
