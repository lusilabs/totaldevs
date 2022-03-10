
import { Table } from '@/components/base/table'
import { useDocuments } from '@/utils/hooks'
import Status from '@/components/misc/status'

export const AdminMatches = ({ userDoc }) => {
  const [matches, _ml, _rm, setMatchesState] = useDocuments({ docs: 'matches' })

  const tableProps = {
    columns: ['title', 'devName', 'dev', 'companyName', 'company', 'explorerName', 'explorer', 'status', 'resume'],
    type: 'matches',
    data: matches,
    getterMapping: {
      title: (row) => row.jobData.title,
      resume: (row) => row.id.split(':')[0]
    },
    renderMapping: {
      resume: (value) => {
        return <a target='_blank' href={`/resumes?profileID=${value}`} rel='noreferrer'>view</a>
      },
      status: (value) => {
        return <Status value={value} red={['dev_unavailable']} />
      }
    }
  }

  return (
    <div className='px-4 py-5'>
      <Table {...tableProps} />
    </div>
  )
}
export default AdminMatches
