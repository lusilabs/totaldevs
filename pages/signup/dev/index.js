import JobForm from '@/components/jobform'

export default function CompanySignupFlow (props) {
  return (
    <JobForm onSaveRoute='/signup/complete' {...props} />
  )
}
