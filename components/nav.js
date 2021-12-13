import Link from 'next/link'
export default function Nav (props) {
  return (
    <nav className='top-0 absolute z-50 w-full flex flex-wrap items-center justify-between px-2 py-3'>
      <Link href='/login' passRef>
        <button
          className='text-white active:bg-gray-100 active:text-gray-900 text-xs font-bold uppercase px-4 py-2 rounded lg:mr-1 lg:mb-0 ml-3 mb-3'
          type='button'
          style={{ transition: 'all .15s ease' }}
        >
          <i className='fas fa-arrow-alt-circle-right' /> Login
        </button>
      </Link>
    </nav>
  )
}
