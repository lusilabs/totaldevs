import { useDocuments } from '@/utils/hooks'
import { where } from 'firebase/firestore'
import Status from '@/components/misc/status'

export default function Devs () {
  const queryConstraints = [
    where('role', '==', 'dev')
  ]
  const [documents, _dl, _dr, _sd] = useDocuments({ docs: 'users', queryConstraints })
  return (
    <div className='flex flex-col m-2 md:m-8 xl:m-16 '>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200'>

              <thead className='bg-gray-50'>
                <tr>
                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    name
                  </th>

                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    stripe
                  </th>

                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    profile
                  </th>

                  <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    USD
                  </th>

                </tr>
              </thead>

              <tbody className='bg-white divide-y divide-gray-200'>
                {documents.map(doc => (
                  <tr key={doc.id}>

                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10'>
                          <a href={doc.photoURL}>
                            <img className='h-10 w-10 rounded-full' src={doc.photoURL} alt='' />
                          </a>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900'>{doc.displayName}</div>
                          <div className='text-sm font-medium text-gray-900'>{doc.email}</div>
                          <div className='text-sm font-medium text-gray-900'>{doc.uid}</div>
                        </div>
                      </div>
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Status green={['verified']} value={doc.stripeVerified ? 'verified' : 'verification pending'} />
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Status green={['complete']} value={doc.isProfileComplete ? 'complete' : 'incomplete'} />
                    </td>

                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{(Number(doc.amount_received) / 100).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
