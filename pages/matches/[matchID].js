import { useForm } from 'react-hook-form'
import { Button, Dropdown } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import { storage, db, functions } from '@/utils/config'
import { httpsCallable } from 'firebase/functions'
import { useDocuments, useDocument } from '@/utils/hooks'
import { doc, setDoc, addDoc, collection, getDoc, where } from 'firebase/firestore'
import { toast } from 'react-toastify'
import sleep from '@/utils/misc'
import { useRouter } from 'next/router'
import TotalResume from '@/components/resume'
import { SuspensePlaceholders } from '@/components/suspense'

const createCheckoutSession = httpsCallable(functions, 'stripe-createCheckoutSession')
const updateMatchDocOnServer = httpsCallable(functions, 'updateMatchDocOnServer')
const INITIAL_PAYMENT_PCT = 0.20

const handleAcceptMatch = async match => {
  const { data } = await createCheckoutSession({ match })
  window.location.assign(data.url)
}

export default function MatchView ({ userDoc, ...props }) {
  const router = useRouter()
  const [routerMatchID, setRouterMatchID] = useState()
  const [isButtonLocked, setIsButtonLocked] = useState()
  const [saving, setSaving] = useState()
  const [buttonColor, setButtonColor] = useState('green')
  const [initialPayment, setInitialPayment] = useState()

  const handleInitialPaymentChange = e => {
    const value = e.target.value
    setInitialPayment((value * INITIAL_PAYMENT_PCT).toFixed(2))
  }

  const [matchDoc, matchLoaded, _dr, setMatchDoc] = useDocument({ collection: 'matches', docID: routerMatchID })
  useEffect(() => {
    const { matchID, success, cancel, session } = router.query
    console.log({ matchID, success, cancel, session })
    setRouterMatchID(matchID)
  })

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()

  useEffect(() => {
    if (matchDoc) {
      setIsButtonLocked(!!matchDoc.locked)
      reset({ startDate: matchDoc.startDate, finalSalary: matchDoc.finalSalary }) // this refires the defaultValues on the form to fill them up once the db data loads.
      setInitialPayment(matchDoc.initialPayment)
    }
  }, [matchDoc])

  const [profileDoc, profileLoaded, _pr, setProfileDoc] = useDocument({ collection: 'profiles', docID: matchDoc?.dev }, [matchDoc])

  const handleClick = () => {
    const { status } = matchDoc
    switch (status) {
      case 'ready_to_pay':
        handleAcceptMatch(routerMatchID)
        break
      case 'fresh':
        // handle
        break
      default:
        console.error(`No such status ${status}`)
    }
  }

  const handleDeclineMatch = () => {
    // todo@checkoutv2 lock match to prevent further modifications
  }

  const onSubmit = async data => {
    setSaving(true)
    if (!initialPayment || initialPayment < 0) {
      toast.error('Initial payment cannot be null or negative')
      return
    }
    await sleep(2000)
    await updateMatchDocOnServer({ matchID: routerMatchID, initialPayment, ...data })
    toast.success('match details saved successfully.')
    setSaving(false)
  }

  // console.log(watch(['finalSalary', 'startDate', ]))
  return (
    <>
      {!(matchLoaded && profileLoaded) && <SuspensePlaceholders />}
      {(matchLoaded && profileLoaded) &&
        <div className='m-4'>
          <h3 className='text-gray-500'>dev resume</h3>

          <div className='flex justify-center '>
            <TotalResume profileID={profileDoc.uid} />
          </div>

          <div className='m-4 overflow-hidden bg-white shadow sm:rounded-lg'>
            <h3 className='p-4 m-4 text-gray-500 text-center'>
              <i className='mr-4 fa fa-calendar text-blue-500' aria-hidden='true' /><a href={profileDoc.calendlyURL}>book a meeting here</a>
            </h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
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
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  {...register('finalSalary', {
                    required: true,
                    min: matchDoc?.jobData.salaryMin,
                    onChange: handleInitialPaymentChange
                  })}
                />
                {errors.finalSalary && <div className='m-2 text-sm text-red-500'>cannot be lower than min salary or null</div>}
              </div>

              <div className='col-span-6 sm:col-span-2'>
                <label htmlFor='startDate' className='block text-sm font-medium text-gray-700'>
                  starting date
                </label>
                <input
                  type='text'
                  id='startDate'
                  name='startDate'
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  {...register('startDate', { required: true })}
                />
                {errors.startDate && <div className='m-2 text-sm text-red-500'>please select a starting date</div>}
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
                  value={initialPayment}
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-200'
                />
              </div>

              <div className='col-span-6'>
                <Button disabled={saving || isButtonLocked} loading={saving} type='submit' color='primary' fluid>
                  {saving && <span>saving...</span>}
                  {!saving && <span>save</span>}
                </Button>
              </div>

            </div>
          </form>

          <div className='flex align-items justify-between m-4'>

            <div className='m-4'>
              <Button disabled={saving} loading={saving} onClick={handleDeclineMatch} color='red'>
                {saving && <span>sending...</span>}
                {!saving && <span>decline application</span>}
              </Button>
            </div>

            <div className='m-4'>
              <Button disabled={saving || isButtonLocked} loading={saving} onClick={handleClick} color={buttonColor}>
                {saving && <span>sending...</span>}
                {!saving && <span>accept and send job offer</span>}
              </Button>
            </div>

          </div>
        </div>}
    </>
  )
}
