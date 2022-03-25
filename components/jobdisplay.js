import { PaperClipIcon } from '@heroicons/react/solid'
import { useEffect } from 'react'
import Link from 'next/link'
// import { functions } from '@/utils/config'
// import { httpsCallable } from 'firebase/functions'

// const checkStripeAccountStanding = httpsCallable(functions, 'stripe-checkStripeAccountStanding')

export default function JobDisplay ({ jobDoc, matches, setIsEditing }) {
  return (
    <>
      {matches &&
        <>
          <h3 className='text-gray-500'>matches</h3>
          <div className='flex flex-col m-4'>
            {matches.length === 0 && <> <span className='flex justify-center p-2 px-4 font-semibold text-yellow-800 bg-yellow-100 rounded-full text-md leading-5'> explorers are looking for a match... (no action required, we will notify you) </span> </>}
            {matches.length > 0 && matches.map((m, ix) =>
              <Link key={m.dev ?? ix} href={`/matches/${m.id}`}>
                <div className='flex items-center justify-between px-4 py-5 m-1 overflow-hidden bg-white shadow cursor-pointer sm:rounded-lg'>
                  <img className='w-8 h-8 rounded-full' src={m.devPhotoURL} alt='' />
                  <div className='fixed left-24'>{m.devName}</div>
                  <div>
                    {m.status !== 'dev_interested' && <span className='inline-flex px-2 text-xs font-semibold text-green-800 bg-green-100 rounded-full leading-5'> OK </span>}
                    {m.status === 'dev_interested' && <span className='inline-flex px-2 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full leading-5'> action required </span>}
                    {/* {!jobDoc.status && <span className='inline-flex px-2 text-xs font-semibold text-red-800 bg-red-100 rounded-full leading-5'> unpublished </span>} */}

                  </div>
                </div>
              </Link>
            )}
          </div>
        </>}

      <h3 className='text-gray-500'>posting</h3>

      <div className='m-4 overflow-hidden bg-white shadow sm:rounded-lg'>
        {setIsEditing &&
          <div className='flex justify-between px-4 py-5 sm:px-6'>
            <button
              className='w-auto h-6 px-4 text-gray-500 bg-indigo-400 rounded-full shadow hover:bg-indigo-700 active:shadow-lg mouse transition ease-in duration-200 focus:outline-none'
              onClick={() => setIsEditing(true)}
            >
              <svg viewBox='0 0 20 20' enableBackground='new 0 0 20 20' className='inline-block w-3 h-3 mr-2'>
                <path
                  fill='#FFFFFF' d='M17.561,2.439c-1.442-1.443-2.525-1.227-2.525-1.227L8.984,7.264L2.21,14.037L1.2,18.799l4.763-1.01
                                    l6.774-6.771l6.052-6.052C18.788,4.966,19.005,3.883,17.561,2.439z M5.68,17.217l-1.624,0.35c-0.156-0.293-0.345-0.586-0.69-0.932
                                    c-0.346-0.346-0.639-0.533-0.932-0.691l0.35-1.623l0.47-0.469c0,0,0.883,0.018,1.881,1.016c0.997,0.996,1.016,1.881,1.016,1.881
                                    L5.68,17.217z'
                />
              </svg>
              <span className='text-sm text-white'>edit</span>
            </button>
          </div>}

        <div className='border-t border-gray-200'>
          <dl>
            <div className='px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>title</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{jobDoc.title}</dd>
            </div>

            <div className='px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>description</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {jobDoc.description}
              </dd>
            </div>
            <div className='px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>stack</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{jobDoc.stack?.join(', ')}</dd>
            </div>

            <div className='px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>salary</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>$ {jobDoc.salaryMin} {jobDoc.salaryMax && ` - ${jobDoc.salaryMax}`} </dd>
            </div>

            <div className='px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>position type</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{jobDoc.position} </dd>
            </div>

            <div className='px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>hours</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{jobDoc.hours} </dd>
            </div>

            <div className='px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>extra docs</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                <ul role='list' className='border border-gray-200 rounded-md divide-y divide-gray-200'>
                  <li className='flex items-center justify-between py-3 pl-3 pr-4 text-sm'>
                    <div className='flex items-center flex-1 w-0'>
                      <PaperClipIcon className='flex-shrink-0 w-5 h-5 text-gray-400' aria-hidden='true' />
                      <span className='flex-1 w-0 ml-2 truncate'>{jobDoc.pdfName}</span>
                    </div>
                    <div className='flex-shrink-0 ml-4'>
                      <a href={jobDoc.pdfURL} target='blank' className='font-medium text-indigo-600 hover:text-indigo-500'>
                        view
                      </a>
                    </div>
                  </li>

                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
