import { useEffect, useState } from 'react'
import { db, functions } from '@/utils/config'
import { doc, setDoc, where } from 'firebase/firestore'
import Link from 'next/link'
import { Table } from '@/components/base/table'
import { useDocuments } from '@/utils/hooks'
import { useRouter } from 'next/router'
import Status from '@/components/misc/status'
import { toast } from 'react-toastify'
import { Button, Dropdown } from 'semantic-ui-react'

const JobCard = ({ status, jobData, id }) => {
  return (
    <Link href={`/projects/${id}`}>
      <div className='group relative cursor-pointer'>
        <div className='w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none hover:z-0'>
          <img src={jobData.photoURL} alt={jobData.photoURL} className='w-full h-full object-center object-cover lg:w-full lg:h-full' />
        </div>
        <div className='mt-4 flex justify-between items-start'>
          <p className='mt-1 text-md text-gray-500'>{jobData.title}</p>
          <p className='text-md font-medium text-gray-900'>$ {jobData.salaryMin} {jobData.salaryMax && ` - ${jobData.salaryMax}`} </p>
          <Status red={['dev_unavailable']} value={status} />
        </div>
      </div>
    </Link>
  )
}

const CustomMobileProjectView = ({ getOrderedData }) => {
  const rows = getOrderedData()
  return (
    <div className='max-w-2xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:max-w-7xl lg:px-8'>
      <div className='mt-8 grid grid-cols-2 gap-y-2 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
        {rows && rows.length > 0 && rows.map((match, ix) => <JobCard key={ix} {...match} />)}
        {rows && rows.length === 0 && <div className='text-md text-gray-600'>no offers yet.</div>}
      </div>
    </div>
  )
}

const ConfirmAvailability = ({ userDoc, selectedMatch, refreshMatches }) => {
  if (!selectedMatch) {
    return null
  }
  const updateMatch = (status, notifyee) => () => {
    const match = doc(db, 'matches', `${selectedMatch.id}`)
    setDoc(match, {
      status
    }, { merge: true })
    toast.success(`${notifyee ?? 'user'} has been notified.`)
    refreshMatches(status)
  }
  return (
    <div className='py-5'>
      <Button
        type='button' color='green' className='text-md'
        onClick={updateMatch('dev_interested', selectedMatch.companyName)}
        disabled={!['dev_interested', 'dev_unavailable'].includes(selectedMatch.status)}
      >
        available, can schedule meeting with client
      </Button>
      <Button
        type='button' color='red' className='text-md'
        onClick={updateMatch('dev_unavailable', selectedMatch.explorerName)}
      >
        not available at the moment
      </Button>
    </div>
  )
}

export const ProjectsToCheck = ({ userDoc }) => {
  const [matches, matchesLoaded, _rm, setMatchesState] = useDocuments({
    docs: 'matches', queryConstraints: [where('dev', '==', userDoc.uid)]
  })
  const router = useRouter()

  const tableProps = {
    columns: ['title', 'min_salary', 'max_salary', 'company name', 'current status', 'explorer name'],
    type: 'matches',
    data: matches,
    onSelect: (row) => router.push(`/projects/${row.id}`),
    getterMapping: {
      'explorer name': (row) => row.explorerName,
      title: (row) => row.jobData.title,
      min_salary: (row) => row.jobData.salaryMin,
      max_salary: (row) => row.jobData.salaryMax,
      'company name': (row) => row.companyName,
      'current status': (row) => row.status
    },
    CustomMobileView: CustomMobileProjectView
  }

  return (
    <div className='px-4 py-5'>
      {matchesLoaded && <Table {...tableProps} checkScreen />}
    </div>
  )
}
