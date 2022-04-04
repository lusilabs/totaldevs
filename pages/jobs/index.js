
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SuspensePlaceholders } from '@/components/suspense'
import TopCornerBadge from '@/components/misc/badge'
import { query, collection, where, orderBy, limit, getDocs } from '@firebase/firestore'
import { db } from '@/utils/config'
import { useDocuments } from '@/utils/hooks'
import Link from 'next/link'
import CreateButton from '@/components/createbutton'

function JobList ({ userDoc, ...props }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [matchesMap, setMatchesMap] = useState({})
  const [jobs, jobsLoaded, _jr, _sj] = useDocuments({ docs: 'jobs', queryConstraints: [where('uid', '==', userDoc.uid)] }, [userDoc.uid])
  const [matches, matchesLoaded, _mr, _sm] = useDocuments({
    docs: 'matches',
    queryConstraints: [
      where('company', '==', userDoc.uid),
      where('status', 'in', ['dev_interested', 'dev_accepted', 'positioned_offered', 'documents_signed', 'billing'])
    ]
  }, [userDoc.uid])

  useEffect(() => {
    const { created, edited } = router.query
    if (created) toast.success('job posting created successfully.')
    if (edited) toast.success('job posting edited successfully.')
  }, [])

  useEffect(() => {
    setIsLoading(!jobsLoaded)
  }, [jobsLoaded])

  useEffect(() => {
    if (matches) {
      setMatchesMap(
        matches.reduce(
          (map, match) => ({ ...map, [match.job]: (map[match.job] || 0) + 1 }), {}
        )
      )
    }
  }, [matches])

  return (
    <div className='max-w-2xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='mt-8 grid grid-cols-2 gap-y-2 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
        {isLoading && <SuspensePlaceholders />}
        {!isLoading && jobs && jobs.length > 0 && jobs.map((j, ix) => <Job key={ix} job={j} numPendingRequests={matchesMap[j.id]} {...props} />)}
        {!isLoading && jobs && jobs.length === 0 && <div className='text-md text-gray-600'>no jobs posted yet.</div>}
        <div className='fixed top-16 right-8 lg:bottom-8 lg:right-4 text-md' onClick={() => router.push('/jobs/add')}>
          <CreateButton extraClasses='bg-green-500' text='new posting' />
        </div>
      </div>
    </div>
  )
}

function Job ({ job, numPendingRequests, ...props }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className='group relative cursor-pointer'>
        <TopCornerBadge count={numPendingRequests} />
        <div className='w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none hover:z-0'>
          <img src={job.photoURL} alt={job.photoURL} className='w-full h-full object-center object-cover lg:w-full lg:h-full' />
        </div>
        <div className='mt-4 flex justify-between items-start'>
          <p className='mt-1 text-md text-gray-500'>{job.title}</p>
          <p className='text-md font-medium text-gray-900'>$ {job.salaryMin} {job.salaryMax && ` - ${job.salaryMax}`} </p>
          {job.status === 'locked' && <span className='px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-green-100 text-green-800'> up to date.  </span>}
          {job.status === 'matching' && <span className='px-2 inline-flex text-md leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> matching </span>}
        </div>
      </div>
    </Link>
  )
}

export default JobList
