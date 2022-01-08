import JobForm from '@/components/jobform'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function AddJob (props) {
  const router = useRouter()
  const [onSaveRoute, setOnSaveRoute] = useState('')
  const { signup = '', convert = false } = router.query
  useEffect(() => {
    if (signup) setOnSaveRoute(`/signup/complete?convert=${convert}`)
  }, [signup, convert])
  return (
    <JobForm onSaveRoute={onSaveRoute} {...props} />
  )
}

export default AddJob
