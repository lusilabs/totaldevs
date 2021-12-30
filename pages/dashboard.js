import Banner from '@/components/banner'
function Dashboard ({ userDoc, ...props }) {
  return (
    <div>
      {userDoc.role === 'explorer' &&
        <Banner name='explorer-invites' text='congratulations! you have 10 gift developer invites' buttonText='invite a dev!' href='/invites' />}
      dashboard.
    </div>
  )
}

export default Dashboard
