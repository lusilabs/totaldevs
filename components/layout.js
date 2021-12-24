import Header from '@/components/header'

function Layout ({ children, ...props }) {
  return (
    <>
      {props.userDoc && <Header {...props} />}
      <main>
        {children}
      </main>
    </>
  )
}

export default Layout
