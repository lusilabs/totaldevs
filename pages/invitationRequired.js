import { signOut } from '@firebase/auth'
import { db, auth } from '@/utils/config'

function InvitationRequired () {
  return (
    <div>
      TODO: put image of astronaut.
      Sorry you cannot access the content a this time, an invitation from another dev is required.
      if you just recently got an invitation, try signing in again to redeem it.
      <button
        className='bg-indigo-800 text-white hover:bg-gray-700 text-xl font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 mt-12'
        onClick={() => signOut(auth)}
      >Sign out
        <i className='fas fa-arrow-alt-circle-right' />
      </button>
    </div>
  )
}

export default InvitationRequired
