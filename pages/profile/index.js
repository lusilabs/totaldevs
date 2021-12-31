import EditDevProfile from '@/components/devprofile'
import EditExplorerProfile from '@/components/explorerprofile'
// import EditCompanyProfile from '@/components/companyprofile'

export default function DevProfile (props) {
  return (
    <>
      {props.userDoc.role === 'dev' && <EditDevProfile {...props} />}
      {props.userDoc.role === 'explorer' && <EditExplorerProfile {...props} />}
      {/* {props.userDoc.role === 'company' && <EditCompanyProfile {...props} />} */}
    </>
  )
}
