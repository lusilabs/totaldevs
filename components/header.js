import { useRouter } from 'next/router'
import Link from 'next/link'
import { auth } from '@/utils/config'
import { Fragment, useState, useEffect } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { mockProducts } from '@/utils/mocker'

function classNames (...classes) {
  return classes.filter(Boolean).join(' ')
}

const mocked = mockProducts(1)[0]

function Header ({ user, userDoc, navigation, userNavigation, ...props }) {
  const [activeTab, setActiveTab] = useState('/')
  const router = useRouter()
  const handleSelectRoute = href => {
    setActiveTab(href)
  }
  const handleUserNavigation = item => {
    if (item.hasOwnProperty('handleClick')) item.handleClick()
    router.push(item.href)
  }
  useEffect(() => {
    setActiveTab(router.pathname)
  })
  return (
    <>
      <Disclosure as='nav' className='bg-gray-800'>
        {({ open }) => (
          <>
            <div className='max-w-full mx-auto px-2 sm:px-4 lg:px-8'>
              <div className='flex items-center justify-between h-16'>
                <div className='flex items-center'>
                  <Link href='/' passRef>
                    <div className='flex-shrink-0'>
                      <img
                        className='h-8 w-8'
                        src='/logo-small.png'
                        alt='logo'
                      />
                    </div>
                  </Link>
                  <div className='block md:block'>
                    <div className='ml-4 flex items-baseline space-x-4'>
                      {navigation.map((item, ix) => {
                        const active = item.href === activeTab
                        // console.log(active, item.href, activeTab)
                        return (
                          <Link href={item.href} key={ix}>
                            <a
                              onClick={() => handleSelectRoute(item.href)}
                              key={item.name}
                              className={classNames(
                                active
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'px-3 py-2 rounded-md text-sm font-medium'
                              )}
                              aria-current={active ? 'page' : undefined}
                            >
                              {item.name}
                            </a>
                          </Link>
                        )
                      }
                      )}
                    </div>
                  </div>
                </div>
                <div className='block md:block'>
                  <div className='ml-4 flex items-center md:ml-6'>
                    <button
                      type='button'
                      className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                    >
                      <span className='sr-only'>View notifications</span>
                      <BellIcon className='h-6 w-6' aria-hidden='true' />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as='div' className='ml-3 relative'>
                      <div>
                        <Menu.Button className='max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
                          <img className='h-8 w-8 rounded-full' src={userDoc.photoURL ?? mocked.img} alt='' />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                      >
                        <Menu.Items className='z-50 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'>
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <a
                                  onClick={() => handleUserNavigation(item)}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>

              </div>
            </div>

          </>
        )}
      </Disclosure>
    </>
  )
}

export default Header
