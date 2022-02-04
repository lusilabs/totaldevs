import { useForm } from 'react-hook-form'
import { Button, Dropdown } from 'semantic-ui-react'
import { useState, useEffect } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage, db } from '@/utils/config'
import { useDocuments, useDocument } from '@/utils/hooks'
import { doc, setDoc, addDoc, collection, getDoc, where } from 'firebase/firestore'
import { toast } from 'react-toastify'
import sleep from '@/utils/misc'
import { useRouter } from 'next/router'

import DevProfileDisplay from '@/components/devprofiledisplay'
import { SuspensePlaceholders } from '@/components/suspense'

export default function MatchView ({ userDoc, ...props }) {
  const router = useRouter()
  const [routerMatchID, setRouterMatchID] = useState()
  const [saving, setSaving] = useState()

const [matchDoc, matchLoaded, _dr, setMatchDoc] = useDocument({ collection: 'matches', docID: routerMatchID })
  useEffect(() => {
    const { matchID } = router.query
    setRouterMatchID(matchID)
  })

  const [profileDoc, profileLoaded, _pr, setProfileDoc] = useDocument({ collection: 'profiles', docID: matchDoc?.dev }, [matchDoc])

  const handleAcceptMatch = () => {}
  const handleDeclineMatch = () => {}

  return (
    <>
    {!(matchLoaded && profileLoaded) && <SuspensePlaceholders />}
    {(matchLoaded && profileLoaded) && 
    <div className='m-4'>
      <h3 className='text-gray-500'>dev profile</h3>
      <DevProfileDisplay userDoc={profileDoc} readOnly />
      <h3 className='text-gray-500'>book a meeting</h3>
      <div className='bg-white shadow overflow-hidden sm:rounded-lg m-4'>
        Dev Calendly goes here
      </div>
      <div className='m-4'>
        <Button disabled={saving} loading={saving} onClick={handleAcceptMatch} color='green' fluid>
          {saving && <span>sending...</span>}
          {!saving && <span>accept application</span>}
        </Button>
      </div>
      <div className='m-4'>
        <Button disabled={saving} loading={saving} onClick={handleDeclineMatch} color='red' fluid>
          {saving && <span>sending...</span>}
          {!saving && <span>decline application</span>}
        </Button>
      </div>
    </div>}
    </>
  )
}
