import { GoogleAuthProvider, linkWithRedirect, getRedirectResult } from 'firebase/auth'
import { auth, db, functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'
import { getAnalytics, logEvent } from 'firebase/analytics'

const handleAnonUserConversion = httpsCallable(functions, 'stripe-handleAnonUserConversion')

function CompleteSignupFlow ({ userDoc, ...props }) {
  const provider = new GoogleAuthProvider()
  const currentUser = auth.currentUser
  const analytics = getAnalytics()
  const handleLinkWithRedirect = () => linkWithRedirect(currentUser, provider).then((result) => {
    // Accounts successfully linked.
    // this never triggers for some reason. so we have to go with the
    // getRedirectResult route to link this user to a provider.
    // const credential = GoogleAuthProvider.credentialFromResult(result)
    // console.log('handleLinkWithRedirect success', { credential, user: result.user })
  }).catch((error) => {
    logEvent(analytics, 'handleLinkWithRedirect error: ' + JSON.stringify(error))
    console.error(error)
  })
  getRedirectResult(auth).then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result)
    if (credential) {
      const user = result.user
      const userData = JSON.parse(JSON.stringify(user.toJSON()))
      const role = localStorage.getItem('totalDevsRole')
      logEvent(analytics, 'getRedirectResult user converted: role ' + role + ' ' + JSON.stringify(userData))
      console.log('setting role', { role })
      handleAnonUserConversion({ ...userData, role })
    }
  }).catch((error) => {
    logEvent(analytics, 'getRedirectResult error: ' + JSON.stringify(error))
    console.error(error)
  })

  return (
    <div onClick={handleLinkWithRedirect}> Am I successful? Yes. </div>
  )
}

export default CompleteSignupFlow
