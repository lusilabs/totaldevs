import JobForm from '@/components/jobform'

function CompanySignupFlow (props) {
  return (
    <JobForm allowSkip onSaveRoute='/signup/complete' {...props} />
  )
}

export default CompanySignupFlow
