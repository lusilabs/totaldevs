import JobForm from '@/components/jobform'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

function AddJob (props) {
  const router = useRouter()
  const [onSaveRoute, setOnSaveRoute] = useState('')
  useEffect(() => {
    const { signup = '' } = router.query
    if (signup) setOnSaveRoute('/signup/complete')
  }, [])
  return (
    <JobForm onSaveRoute={onSaveRoute} {...props} />
  )
}

export default AddJob
