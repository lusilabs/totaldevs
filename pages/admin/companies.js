import { useDocuments } from '@/utils/hooks'
import { PaperClipIcon } from '@heroicons/react/solid'

import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore'

export default function Companies () {
  const queryConstraints = [
    where('role', '==', 'company')
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

                  {/* <th
                    scope='col'
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider'
                  >
                    stripe
                  </th> */}

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
                          &nbsp;
                          <div className='text-sm font-medium text-gray-900'>{doc.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* <td className='px-6 py-4 whitespace-nowrap'>
                      {doc.stripeVerified && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'> verified </span>}
                      {!doc.stripeVerified && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> verification pending </span>}
                    </td> */}

                    <td className='px-6 py-4 whitespace-nowrap'>
                      {doc.isProfileComplete && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'> complete </span>}
                      {!doc.isProfileComplete && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> incomplete </span>}
                    </td>

                    {/* <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      {doc.charges?.data?.length > 0 && <Link href={doc.charges.data[0].receipt_url}>
                        <a className='text-indigo-600 hover:text-indigo-900'>
                          Ver
                        </a>
                      </Link>}
                    </td> */}

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
