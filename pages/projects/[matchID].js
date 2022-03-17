import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Button } from 'semantic-ui-react'
import JobDisplay from '@/components/jobdisplay'
import { db } from '@/utils/config'

const ConfirmAvailability = ({ matchDoc, router }) => {
  const updateMatch = (status, notifyee) => () => {
    const match = doc(db, 'matches', matchDoc.id)
    setDoc(match, {
      status
    }, { merge: true })

    toast.success(`${notifyee} has been notified.`)
    router.push('/projects')
  }

  return (
    <>
      <div className='m-4'>
        <Button
          fluid type='button' color='green' className='text-md'
          onClick={updateMatch('dev_interested', matchDoc.companyName)}
        >
          Available, can schedule meeting with client
        </Button>
      </div>
      <div className='m-4'>
        <Button
          fluid type='button' color='red' className='text-md'
          onClick={updateMatch('dev_unavailable', matchDoc.explorerName)}
        >
          Not available at the moment
        </Button>
      </div>
    </>
  )
}

const ViewProject = ({ props }) => {
  const router = useRouter()
  const { matchID } = router.query
  const [matchDoc, setMatchDoc] = useState()
  useEffect(() => {
    const retrieveJob = async () => {
      const ref = doc(db, 'matches', matchID)
      const match = await getDoc(ref)
      setMatchDoc({ ...match.data(), id: matchID })
    }
    if (matchID) retrieveJob()
  }, [matchID])
  if (!matchDoc) {
    return null
  }
  return (
    <div className='m-4'>
      <JobDisplay {...{ jobDoc: matchDoc.jobData }} />
      <ConfirmAvailability {...{ matchDoc, router }} />
    </div>
  )
}

export default ViewProject
