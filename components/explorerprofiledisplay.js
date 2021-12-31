import { PaperClipIcon } from '@heroicons/react/solid'

export default function ExplorerProfileDisplay ({ userDoc, setIsEditing }) {
  return (
    <div className='bg-white shadow overflow-hidden sm:rounded-lg m-4'>
      <div className='px-4 py-5 sm:px-6'>
        <div className='flex flex-row justify-between items-center'>
          <div>
            {userDoc.role === 'dev' && <>
              {userDoc.status === 'verified' && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'> verified </span>}
              {userDoc.status === 'pending' && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> pending </span>}
              {userDoc.status === 'verify' && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> verify </span>}
              {userDoc.status === 'incomplete' && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> incomplete </span>}
              {!userDoc.status && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'> unpublished </span>}
            </>}
            {userDoc.role !== 'dev' && <>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>dev information</h3>
              <p className='mt-1 max-w-2xl text-sm text-gray-500'>personal details and application.</p>
            </>}

          </div>
          <div>
            <button
              className='text-gray-500 px-4 w-auto h-6 bg-gray-400 rounded-full hover:bg-gray-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none'
              onClick={() => setIsEditing(true)}
            >
              <svg viewBox='0 0 20 20' enableBackground='new 0 0 20 20' className='w-3 h-3 inline-block mr-2'>
                <path
                  fill='#FFFFFF' d='M17.561,2.439c-1.442-1.443-2.525-1.227-2.525-1.227L8.984,7.264L2.21,14.037L1.2,18.799l4.763-1.01
                                    l6.774-6.771l6.052-6.052C18.788,4.966,19.005,3.883,17.561,2.439z M5.68,17.217l-1.624,0.35c-0.156-0.293-0.345-0.586-0.69-0.932
                                    c-0.346-0.346-0.639-0.533-0.932-0.691l0.35-1.623l0.47-0.469c0,0,0.883,0.018,1.881,1.016c0.997,0.996,1.016,1.881,1.016,1.881
                                    L5.68,17.217z'
                />
              </svg>
              <span className='text-white text-sm'>edit</span>
            </button>
          </div>
        </div>
      </div>
      <div className='border-t border-gray-200'>
        <dl>
          <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>name</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{userDoc.displayName}</dd>
          </div>

          <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>bio</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              {userDoc.bio}
            </dd>
          </div>

          <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
            <dt className='text-sm font-medium text-gray-500'>resumé</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
              <ul role='list' className='border border-gray-200 rounded-md divide-y divide-gray-200'>
                <li className='pl-3 pr-4 py-3 flex items-center justify-between text-sm'>
                  <div className='w-0 flex-1 flex items-center'>
                    <PaperClipIcon className='flex-shrink-0 h-5 w-5 text-gray-400' aria-hidden='true' />
                    <span className='ml-2 flex-1 w-0 truncate'>{userDoc.resumeName}</span>
                  </div>
                  <div className='ml-4 flex-shrink-0'>
                    <a href={userDoc.resumeURL} target='blank' className='font-medium text-indigo-600 hover:text-indigo-500'>
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
  )
}
