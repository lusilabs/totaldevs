import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { db, functions } from '@/utils/config'
import { doc, setDoc, where } from 'firebase/firestore'
import { Table } from '@/components/base/table'
import { Button } from 'semantic-ui-react'
import { useDocuments } from '@/utils/hooks'

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
  const [matches, _ml, _rm, setMatchesState] = useDocuments({ docs: 'matches', queryConstraints: [where('dev', '==', userDoc.uid)] })
  const [selectedMatch, setSelectedMatch] = useState(null)

  const tableProps = {
    columns: ['title', 'min_salary', 'max_salary', 'company name', 'current status', 'explorer name'],
    type: 'matches',
    data: matches,
    onSelect: setSelectedMatch,
    getterMapping: {
      'explorer name': (row) => row.explorerName,
      title: (row) => row.jobData.title,
      min_salary: (row) => row.jobData.salaryMin,
      max_salary: (row) => row.jobData.salaryMax,
      'company name': (row) => row.companyName,
      'current status': (row) => row.status
    }
  }

  const refreshMatches = (status) => {
    return setMatchesState(matches.map((match) => match.id !== selectedMatch.id
      ? match
      : { ...match, status }))
  }

  return (
    <div className='px-4 py-5'>
      <Table {...tableProps} />
      {selectedMatch &&
        <ConfirmAvailability {...{ userDoc, matches, selectedMatch, refreshMatches }} />}
    </div>
  )
}
