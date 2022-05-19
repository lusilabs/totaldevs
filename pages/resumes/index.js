import { useRouter } from 'next/router'
import TotalResume from '@/components/resume'

export default function Resumes ({ handleCreateJobPosting }) {
  const router = useRouter()
  return <TotalResume {...router.query} handleCreateJobPosting={handleCreateJobPosting} />
}
