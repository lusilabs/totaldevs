import Landing from './landing'
import Error from 'next/error'
// import Home from './home'

function Loader () {
  return (
    // <h2>Loading Index... is this used???... remove if unused...</h2>
    null
  )
}

export default function Index (props) {
  const { user, userError, userLoading } = props
  return (
    <div>
      {true && <Error title='Error while retrieving user' statusCode={500} />}
      {userLoading && <Loader />}
      {/* {!user && <Landing />} */}
      {/* {user && <Dashboard {...props} />} */}
    </div>
  )
}
