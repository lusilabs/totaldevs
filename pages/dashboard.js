import { db } from '@/utils/config'
import { useRouter } from 'next/router'
import { useDocuments } from '@/utils/hooks'
import { setDoc, doc, limit, where } from '@firebase/firestore'
import { SuspensePlaceholders } from '@/components/suspense'
import { SpeakerphoneIcon } from '@heroicons/react/outline'
import Banner from '@/components/banner'

function Dashboard ({ userDoc, setIsPageLoading, ...props }) {
  const queryConstraints = [
    where('uid', '==', userDoc.uid),
    where('seen', '==', false),
    // orderBy('priority', 'desc'),
    limit(20)
  ]

  const router = useRouter()
  const [actions, actionsLoaded, _ar, _as] = useDocuments({ userDoc, docs: 'actions', queryConstraints })
  const handleClickOnAction = action => {
    const aref = doc(db, 'actions', action.id)
    setDoc(aref, { seen: true }, { merge: true })
    if (!action.noop) router.push(action.url)
  }
  console.log({ userDoc })

  return (
    <div>

      {!actionsLoaded && <SuspensePlaceholders />}
      {actionsLoaded && !userDoc?.email && <Banner name='profile-complete' color='bg-red-400' text='sign up to keep in touch' buttonText='click here' href='/signup/complete?convert=undefined' />}
      {actionsLoaded && actions.length === 0 && <EmptyDashboardView />}
      {/* {actionsLoaded && actions.length > 0 && actions.map((a, aix) => <ActionView action={a} key={a.id} handleClickOnAction={handleClickOnAction} />)} */}
      {actionsLoaded && actions.length > 0 && <ActionView actions={actions} handleClickOnAction={handleClickOnAction} />}
    </div>
  )
}

const EmptyDashboardView = () => {
  return (
    <div className='flex flex-col items-center'>
      <img src='/astronaut.png' className='w-40 mt-4' />
      <h4 className='text-gray-500'>welcome to hyperspace!</h4>
    </div>
  )
}

const ActionView = ({ actions, handleClickOnAction }) => {
  return (
    <>
      <div className='flex items-center mt-4 p-4'>
        <SpeakerphoneIcon className='h-6 w-6 text-indigo-400' aria-hidden='true' />
        <p className='ml-4 text-lg font-bold text-indigo-400'>notifications</p>
      </div>
      <div className='w-11/12 lg:10/12 mx-auto relative mt-2 p-6'>
        <div className='border-l-2 mt-6'>
          {actions.map((a, aix) => <ActionCard action={a} key={aix} handleClickOnAction={handleClickOnAction} />)}
        </div>
      </div>
    </>
  )
}

const ActionCard = ({ action, handleClickOnAction }) => {
  const colorMaps = {
    // we have to do this instead of building css classes dynamically because purgeCSS will just remove them. see README
    red: 'bg-red-200',
    green: 'bg-green-200',
    amber: 'bg-green-200',
    indigo: 'bg-indigo-200'
  }
  const textColorMap = {
    red: 'text-red-700',
    green: 'text-green-700',
    amber: 'text-green-700',
    indigo: 'text-indigo-700'
  }

  const textColor = textColorMap[action.color] || 'text-yellow-700'
  const cardColor = colorMaps[action.color] || 'bg-yellow-200'
  return (
    <div className={'transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-4 py-2 rounded mb-8 flex-col md:flex-row space-y-4 md:space-y-0 ' + cardColor} onClick={() => handleClickOnAction(action)}>

      <div className='w-5 h-5 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0'>
        {action.icon === 'times' && <i className={'fas fa-times-circle fa-lg ' + textColor} />}
        {(action.icon === 'warning' || action.icon === 'alert') && <i className={'fas fa-exclamation-triangle fa-lg ' + textColor} />}
        {action.icon === 'check' && <i className={'fas fa-check-square fa-lg ' + textColor} />}
        {(action.icon === 'info' || !action.icon) && <i className={'fas fa-info-circle fa-lg ' + textColor} />}
      </div>

      <div className='w-8 h-1 absolute -left-8 z-0 bg-gray-200' />

      <div className='flex justify-evenly min-w-full'>
        <p className={'text-sm font-bold ' + textColor}>{action.text}</p>
        <i className={'fas fa-sign-in-alt fa-lg ' + textColor} />
      </div>
    </div>
  )
}

export default Dashboard
