
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SuspensePlaceholders } from '@/components/suspense'
import { query, collection, where, orderBy, limit, getDocs } from '@firebase/firestore'
import { db } from '@/utils/config'
import Link from 'next/link'
import CreateButton from '@/components/createbutton'

function JobList ({ userDoc, ...props }) {
  const router = useRouter()
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { created, edited } = router.query

  useEffect(() => {
    if (created) toast.success('Job posting created successfully.')
    if (edited) toast.success('Job posting edited successfully.')
    const retrieveJobs = async () => {
      const q = query(collection(db, 'jobs'), where('uid', '==', userDoc.uid), orderBy('createdAt'), limit(10))
      const querySnapshot = await getDocs(q)
      const snaps = []
      querySnapshot.forEach(doc => {
        snaps.push({ id: doc.id, ...doc.data() })
      })
      setJobs(snaps)
      setIsLoading(false)
    }
    retrieveJobs()
  }, [])
  return (
    <div className='max-w-2xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='mt-6 grid grid-cols-2 gap-y-2 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
        {isLoading && <SuspensePlaceholders />}
        {!isLoading && jobs.length > 0 && jobs.map((s, ix) => <CatalogProduct key={ix} job={s} {...props} />)}
        {!isLoading && jobs.length === 0 && <div className='text-md text-gray-600'>No jobs posted yet.</div>}
        <div className='fixed bottom-16 right-8 lg:bottom-8 lg:right-4 text-md' onClick={() => router.push('/jobs/add')}> <CreateButton /> </div>
      </div>
    </div>
  )
}

function CatalogProduct ({ job, ...props }) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <div className='group relative'>
        <div className='w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none'>
          <img src={job.photoURL} alt={job.photoURL} className='w-full h-full object-center object-cover lg:w-full lg:h-full' />
        </div>
        <div className='mt-4 flex justify-between items-start'>
          <p className='mt-1 text-sm text-gray-500'>{job.title}</p>
          <p className='text-sm font-medium text-gray-900'>$ {job.salary} </p>
          {job.status === 'good' && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'> up to date.  </span>}
          {job.status === 'seeking' && <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> review </span>}
        </div>
      </div>
    </Link>
  )
}

export default JobList
