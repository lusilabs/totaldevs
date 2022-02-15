import { SpeakerphoneIcon, XIcon } from '@heroicons/react/outline'
import Link from 'next/link'

export default function Banner ({ text, buttonText, href, handleClick, handleClose, ...props }) {
  return (
    <div className={props.color}>
      <div className='max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between flex-wrap'>
          <div className='w-0 flex-1 flex items-center'>
            <span className={'flex p-2 rounded-lg ' + props.color}>
              <SpeakerphoneIcon className='h-6 w-6 text-white' aria-hidden='true' />
            </span>
            <p className='ml-3 font-medium text-white truncate'>
              {text}
            </p>
          </div>
          <div className='order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto'>
            {href &&
              <Link href={href}>
                <a
                  className='flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-white hover:bg-indigo-50'
                >
                  {buttonText}
                </a>
              </Link>}
            {handleClick &&
              <a
                className='flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-white hover:bg-indigo-50'
                onClick={handleClick}
              >
                {buttonText}
              </a>}
          </div>
          <div className='order-2 flex-shrink-0 sm:order-3 sm:ml-3'>

            {handleClose &&
              <button
                type='button'
                className='-mr-1 flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2'
                onClick={handleClose}
              >
                <span className='sr-only'>close</span>
                <XIcon className='h-6 w-6 text-white' aria-hidden='true' />
              </button>}
          </div>
        </div>
      </div>
    </div>
  )
}
