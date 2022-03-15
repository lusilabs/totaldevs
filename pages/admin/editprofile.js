import { useRouter } from 'next/router'
import EditDevProfile from '@/components/devprofile'
import { useDocument } from '@/utils/hooks'
import { useState, useEffect } from 'react'
import { SuspensePlaceholders } from '@/components/suspense'

export default function EditProfile () {
  const router = useRouter()
  const [routerProfileID, setRouterProfileID] = useState()
  const [profileDoc, profileLoaded, _pr] = useDocument({ collection: 'profiles', docID: routerProfileID }, [routerProfileID])
  useEffect(() => {
    const { profileID } = router.query
    setRouterProfileID(profileID)
  }, [])
  return (
    <>
      {!profileLoaded && <SuspensePlaceholders />}
      {profileLoaded && <EditDevProfile userDoc={profileDoc} />}
    </>
  )
}
