import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { db, functions } from '@/utils/config'
import { doc, setDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { Table } from '@/components/base/table'
import { Button } from 'semantic-ui-react'

const getAssignments = httpsCallable(functions, 'getAssignments')

const ConfirmAvailability = ({ userDoc, selectedAssignment, refreshAssignments }) => {
  if (!selectedAssignment) {
    return null
  }
  const updateAssignment = (status, notifyee) => () => {
    const assignment = doc(db, 'assignments', `${selectedAssignment.id}`)
    setDoc(assignment, {
      status
    }, { merge: true })
    toast.success(`${notifyee} has been notified.`)
    refreshAssignments(status)
  }
  return (
    <div className='py-5'>
      <Button
        type='button' color='green' className='text-md'
        onClick={updateAssignment('dev_interested', selectedAssignment.company.providerData[0].displayName)}
      >
        Available, can schedule meeting with client
      </Button>
      <Button
        type='button' color='red' className='text-md'
        onClick={updateAssignment('dev_unavailable', selectedAssignment.explorer.displayName)}
      >
        Not available at the moment
      </Button>
    </div>
  )
}

export const ProjectsToCheck = ({ userDoc }) => {
  const [assignments, setAssignments] = useState([])
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  useEffect(async () => {
    const { data } = await getAssignments()
    setAssignments(data)
  }, [])

  const tableProps = {
    columns: ['title', 'salary', 'company name', 'current status', 'explorer name'],
    type: 'assignments',
    data: assignments,
    onSelect: setSelectedAssignment,
    getterMapping: {
      'explorer name': (row) => row.explorer.displayName,
      title: (row) => row.job.title,
      salary: (row) => row.job.salary,
      'company name': (row) => row.company.providerData[0].displayName,
      'current status': (row) => row.status
    }
  }

  const refreshAssignments = (status) => {
    return setAssignments(assignments.map((assignment) => assignment.id !== selectedAssignment.id
      ? assignment
      : { ...assignment, status }))
  }

  return (
    <div className='px-4 py-5'>
      <Table {...tableProps} />
      {selectedAssignment &&
        <ConfirmAvailability {...{ userDoc, assignments, selectedAssignment, refreshAssignments }} />}
    </div>
  )
}
