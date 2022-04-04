import { useState, useEffect } from 'react'
import { useDocument } from '@/utils/hooks'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { Button } from 'semantic-ui-react'
import JobDisplay from '@/components/jobdisplay'
import { db } from '@/utils/config'
import { SuspensePlaceholders } from '@/components/suspense'

const ConfirmAvailability = ({ userDoc, matchDoc, setMatch }) => {
  const updateMatch = (status, notifyee) => async () => {
    const mref = doc(db, 'matches', matchDoc.id)
    await setDoc(mref, { status }, { merge: true })
    toast.success(`${notifyee ?? 'company'} has been notified.`)
  }
  const waitingOnCompany = ['dev_interested', 'position_offered'].includes(matchDoc.status)
  const canContinue = matchDoc.status === 'requesting_dev_status'
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
        disabled={waitingOnCompany}
      >
        {canContinue && 'available for meetings'}
        {waitingOnCompany && 'waiting on company'}
      </Button>
    </div>
  )
}

const ViewProject = props => {
  const router = useRouter()
  const [selectedMatchID, setSelectedMatchID] = useState()
  const [matchDoc, loaded, _rm, setMatch] = useDocument({ collection: 'matches', docID: selectedMatchID }, [selectedMatchID])
  useEffect(() => {
    const { matchID } = router.query
    setSelectedMatchID(matchID)
  }, [])
  return (
    <div className='m-4'>
      {!loaded && <SuspensePlaceholders />}
      {loaded && <>
        <JobDisplay {...{ jobDoc: matchDoc.jobData }} {...props} />
        <ConfirmAvailability {...{ matchDoc, router }} setMatch={setMatch} {...props} />
      </>}
    </div>
  )
}

const MatchSpecificFields = ({ matchDoc }) => {
  return (
    <div className='relative m-4 p-4 md:m-6 md:p-6 rounded-lg overflow-hidden shadow grid grid-cols-6 gap-6 pb-12'>

      <div className='col-span-6'>
        <div className='text-lg font-medium text-gray-500'>match specific fields</div>
      </div>

      <div className='col-span-6 sm:col-span-2'>
        <label htmlFor='finalSalary' className='block text-sm font-medium text-gray-700'>
          final agreed salary USD
        </label>
        <input
          type='number'
          id='finalSalary'
          name='finalSalary'
          disabled
          value={matchDoc.finalSalary}
          className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
        />
      </div>

      <div className='col-span-6 sm:col-span-2'>
        <label htmlFor='startDate' className='block text-sm font-medium text-gray-700'>
          starting date
        </label>

        <input
          type='date'
          id='startDate'
          name='startDate'
          disabled
          className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          value={matchDoc.startDate}
        />
      </div>

      <div className='col-span-6 sm:col-span-2'>
        <label htmlFor='initialPayment' className='block text-sm font-medium text-gray-700'>
          initial payment USD
        </label>
        <input
          disabled
          type='number'
          id='initialPayment'
          name='initialPayment'
          value={matchDoc.initialPayment}
          className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-200'
        />
      </div>

    </div>
  )
}

export default ViewProject
