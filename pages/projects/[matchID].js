import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Button } from 'semantic-ui-react'
import JobDisplay from '@/components/jobdisplay'
import { db } from '@/utils/config'

const ConfirmAvailability = ({ userDoc, matchDoc, refreshMatches }) => {
  if (!matchDoc) {
    return null
  }
  const updateMatch = (status, notifyee) => () => {
    const match = doc(db, 'matches', `${matchDoc.id}`)
    setDoc(match, {
      status
    }, { merge: true })
    toast.success(`${notifyee ?? 'user'} has been notified.`)
    refreshMatches(status)
  }
  return (
    <div className='py-5 flex justify-around'>
      <Button
        type='button' color='red' className='text-md'
        onClick={updateMatch('dev_unavailable', matchDoc.explorerName)}
      >
        not available
      </Button>

      <Button
        type='button' color='green' className='text-md'
        onClick={updateMatch('dev_interested', matchDoc.companyName)}
        disabled={['dev_interested'].includes(matchDoc.status) || !userDoc.isStripeVerified}
      >
        accept match
      </Button>
    </div>
  )
}


const ViewProject = props => {
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
      <JobDisplay {...{ jobDoc: matchDoc.jobData }} {...props} />
      <ConfirmAvailability {...{ matchDoc, router }} {...props} />
    </div>
  )
}

export default ViewProject
