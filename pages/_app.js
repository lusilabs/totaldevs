import 'tailwindcss/tailwind.css'
import 'semantic-ui-css/semantic.min.css'
import 'react-toastify/dist/ReactToastify.css'
import 'nprogress/nprogress.css'
import { auth, db, functions, analytics } from '@/utils/config'
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
import LogRocket from 'logrocket'
import { BellIcon, CurrencyDollarIcon } from '@heroicons/react/outline'

LogRocket.init('h3lsgb/totaldevs')

Router.events.on('routeChangeStart', NProgress.start)
Router.events.on('routeChangeComplete', NProgress.done)
Router.events.on('routeChangeError', NProgress.done)
NProgress.configure({ showSpinner: false })

const anonRoutes = [
  // these routes are hard-matches and allow anon users to visit sensitive pages so add with care.
  '/terms',
  '/privacy',
  '/login',
  '/login?role=dev',
  '/login?role=dev&convert=false',
  '/login?role=explorer',
  '/login?role=company',
  '/login?role=explorer&convert=true',
  '/login?role=explorer&convert=false',
  '/signup',
  '/signup?convert=true',
  '/signup/company',
  '/signup/explorer',
  '/signup/complete',
  '/signup/complete?convert=true',
  '/signup/complete?convert=undefined',
  '/jobs/add?signup=true',
  '/jobs/add?signup=true&convert=true',
  '/jobs/add?signup=true&convert=false'
]

const regexAnonRoutes = [
  // be very careful adding routes here!
  /^\/resumes\/*/g
]

const pageNavigationByRole = {
  dev: [
    { name: 'matches', href: '/projects', current: false },
    // { name: 'content', href: '/content', current: false },
    { name: 'payments', href: '/payments', current: false },
    { name: 'invites', href: '/invites', current: false, Icon: <CurrencyDollarIcon className='w-4 h-4 text-green-400' /> }
  ],
  company: [
    { name: 'jobs', href: '/jobs', current: false }
  ],
  explorer: [
    { name: 'matches', href: '/matches', current: false },
    { name: 'payments', href: '/payments', current: false },
    { name: 'invites', href: '/invites', current: false, Icon: <CurrencyDollarIcon className='w-4 h-4 text-green-400' /> }
  ]
}

const userNavigationByRole = {
  dev: [
    { name: 'profile', href: '/profile' },
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
  { name: 'register', href: '/login?role=company' },
  { name: 'logout', href: '/', handleClick: () => signOut(auth) }
]

const handleAnonUserConversion = httpsCallable(functions, 'handleAnonUserConversion')

function MyApp ({ Component, pageProps }) {
  const [user, isUserLoading, error] = useAuthState(auth)
  const [userDoc, setUserDoc] = useState()
  const [navigation, setNavigation] = useState(anonNavigation)
  const [userNavigation, setUserNavigation] = useState(anonUserNavigation)
  const router = useRouter()
  const onAnonRoutes = anonRoutes.includes(router.asPath) || regexAnonRoutes.some(regex => regex.test(router.asPath))
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

  const handleCreateJobPosting = async ({ convert }) => {
    setIsPageLoading(true)
    if (!convert) await signInAnonymously(auth)
    await sleep(2000)
    router.push(`/jobs/add?signup=true&convert=${convert}`)
    logEvent(analytics, 'new company signup')
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
          // logEvent(analytics, 'getRedirectResult user converted: role ' + role + ' ' + JSON.stringify(userData))
          await handleAnonUserConversion({ ...userData, role: 'company' })
          await sleep(2000)
          setIsPageLoading(false)
          router.push('/jobs?created=true')
        }
      } catch (err) {
        // logEvent(analytics, 'getRedirectResult error: ' + JSON.stringify(err))
        console.error(err)
        setIsPageLoading(false)
      }
    }
    awaitRedirectResults()
  }, [userDoc])

  if (!onAnonRoutes && user && userDoc && userDoc.role === 'dev' && !userDoc.hasAcceptedInvite) {
    return <InvitationRequired userDoc={userDoc} setIsPageLoading={setIsPageLoading} {...pageProps} />
  }

  if (onAdminRoutes && !userDoc?.isAdmin) return null

  return (
    <>

      {(isUserLoading || isPageLoading) && <Spinner />}
      {error && <Error title='error while retrieving user' statusCode={500} />}
      {!user && !isUserLoading && !onAnonRoutes && <Landing profiles={profiles} setIsPageLoading={setIsPageLoading} handleCreateJobPosting={handleCreateJobPosting} />}
      {user && userDoc && !onAnonRoutes &&
        <Layout user={user} userDoc={userDoc} navigation={navigation} userNavigation={userNavigation} {...pageProps}>
          <Component user={user} userDoc={userDoc} setIsPageLoading={setIsPageLoading} {...pageProps} />
          <ToastContainer pauseOnFocusLoss={false} autoClose={2000} />
        </Layout>}
      {onAnonRoutes &&
        <>
          <Component user={user} userDoc={userDoc} setIsPageLoading={setIsPageLoading} handleCreateJobPosting={handleCreateJobPosting} {...pageProps} />
          <ToastContainer pauseOnFocusLoss={false} autoClose={2000} />
        </>}
    </>
  )
}

export default MyApp
