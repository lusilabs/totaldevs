import { auth, db, functions } from '@/utils/config'
import { getDoc, getDocs, collection, doc, query, limit, where, orderBy } from '@firebase/firestore'
import { useEffect, useState } from 'react'
import { InformationCircleIcon, BadgeCheckIcon } from '@heroicons/react/solid'
import { httpsCallable } from 'firebase/functions'
import { useRouter } from 'next/router'
import { mockProducts } from '@/utils/mocker'
import Link from 'next/link'
import { SuspensePlaceholders } from '@/components/suspense'
import CreateButton from '@/components/createbutton'
import { toast } from 'react-toastify'

function Invites ({ userDoc, ...props }) {
  const [isLoading, setIsLoading] = useState(true)
  const [invites, setInvites] = useState([])
  const router = useRouter()
  const { created } = router.query
  useEffect(() => {
    if (created) { toast.success('Invite sent!', { position: toast.POSITION.TOP_CENTER }) }
  }, [])

  const retrieveUserInvites = async () => {
    const snaps = []
    const q = query(collection(db, 'invites'),
      where('referrer', '==', userDoc.email))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
      snaps.push({ id: doc.id, ...doc.data() })
    })

    return snaps
  }
  useEffect(() => {
    const getInvites = async () => {
      const invites = await retrieveUserInvites()
      setInvites(invites)
      setIsLoading(false)
    }
    getInvites()
  }, [userDoc])
  return (
    <>
      {isLoading && <SuspensePlaceholders />}
      {!isLoading && <div>
        <div className='text-md m-10 mt-12 pt-6'>

          <p>
            help your friends get a job with international software companies!
            you will receive 1% per month for each dev hired by the company!  🤑 🤑
          </p>
          <p>
            there is no limit to how many companies you can invite.  you will get 1% per company per month once they have a match! 💸💸
          </p>

        </div>
        <div className='flex flex-row m-1 md:m-8 xl:m-16 justify-around items-center'>

          <div className='flex flex-col p-2 m-2'>
            <div>sent</div>
            <div className='text-4xl'>{invites.length}</div>
          </div>

          <div className='flex flex-col p-2 m-2'>
            <div>redeemed</div>
            <div className='text-4xl'>{invites.filter(i => i.redeemed).length}</div>
          </div>

          <div className='flex flex-col p-2 m-2'>
            <div>remaining (dev)</div>
            <div className='text-4xl'>{userDoc.numInvitesLeft}</div>
          </div>

          {/* <div className='flex flex-col p-2 m-2'>
            <div className='text-md text-purple-600 cursor-pointer' onClick={handleNavigateToOwnerDashboard}>Ver detalles</div>
          </div> */}

        </div>
        <div className='text-md uppercase text-left text-gray-400 mx-6'>Invites</div>
        <div className='flex flex-col m-2 md:m-8 xl:m-16 '>
          <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
              <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        email
                      </th>

                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        role
                      </th>

                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        invite
                      </th>

                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        active
                      </th>

                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        USD $
                      </th>

                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {invites.map(inv => (
                      <tr key={inv.id}>
                        <td className='px-6 py-4 whitespace-nowrap '>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>{inv.id}</div>
                          </div>
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap '>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>{inv.role}</div>
                          </div>
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap'>
                          {inv.redeemed && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                            redeemed
                          </span>}
                          {!inv.redeemed && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'>
                            pending
                          </span>}
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap'>
                          {inv.isActive && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                            active
                          </span>}
                          {!inv.isActive && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'>
                            inactive
                          </span>}
                        </td>

                        <td className='px-6 py-4 whitespace-nowrap '>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>{inv.usd}</div>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {userDoc.numInvitesLeft > 0 && <div className='fixed top-16 right-8 lg:bottom-8 lg:right-4 text-md' onClick={() => router.push('invites/add/dev')}>
            <CreateButton text='dev' extraClasses='bg-green-500 hover:bg-green-700' />
          </div>}
          <div className='fixed top-16 right-32 lg:bottom-8 lg:right-32 text-md' onClick={() => router.push('invites/add/company')}>
            <CreateButton text='company' extraClasses='bg-indigo-500 hover:bg-indigo-700' />
          </div>
        </div>
                     </div>}
    </>
  )
}

export default Invites
