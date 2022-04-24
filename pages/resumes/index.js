import { useRouter } from 'next/router'
import TotalResume from '@/components/resume'

export default function Resumes() {
  const router = useRouter()
  return <TotalResume {...router.query} />
}
