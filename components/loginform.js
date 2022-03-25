import { useForm } from 'react-hook-form'

function LoginForm ({ handleProviderLogin, allowRecovery, handleEmailPasswordLogin }) {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()
  const onSubmit = (data) => {
    handleEmailPasswordLogin(data.email, data.password)
  }
  return (
    <div className='container h-full px-4 mx-auto'>
      <div className='flex items-center content-center justify-center h-full'>
        <div className='w-full px-4 lg:w-4/12'>
          <div className='relative flex flex-col w-full min-w-0 mb-6 break-words bg-gray-300 border-0 rounded-lg shadow-lg'>
            <div className='px-6 py-6 mb-0 rounded-t'>
              <div className='mb-3 text-center'>
                <h6 className='text-sm font-bold text-gray-600'>
                  with
                </h6>
              </div>
              <div className='text-center btn-wrapper'>
                <button
                  className='inline-flex items-center px-4 py-2 mb-1 mr-2 text-xs font-bold text-gray-800 uppercase bg-white rounded shadow outline-none active:bg-gray-100 focus:outline-none hover:shadow-md'
                  type='button'
                  style={{ transition: 'all .15s ease' }}
                  onClick={() => handleProviderLogin('github')}
                >
                  <img
                    alt='...'
                    className='w-5 mr-1'
                    src='/github.svg'
                  />
                  github
                </button>
                <button
                  className='inline-flex items-center px-4 py-2 mb-1 mr-1 text-xs font-bold text-gray-800 uppercase bg-white rounded shadow outline-none active:bg-gray-100 focus:outline-none hover:shadow-md'
                  type='button'
                  style={{ transition: 'all .15s ease' }}
                  onClick={() => handleProviderLogin('google')}
                >
                  <img
                    alt='...'
                    className='w-5 mr-1'
                    src='/google.svg'
                  />
                  google
                </button>
                <button
                  className='inline-flex items-center px-4 py-2 mb-1 mr-1 text-xs font-bold text-gray-800 uppercase bg-white rounded shadow outline-none active:bg-gray-100 focus:outline-none hover:shadow-md'
                  type='button'
                  style={{ transition: 'all .15s ease' }}
                  onClick={() => handleProviderLogin('facebook')}
                >
                  <img
                    alt='...'
                    className='w-5 mr-1'
                    src='/facebook.svg'
                  />
                  facebook
                </button>
              </div>
              <hr className='mt-6 border-gray-400 border-b-1' />
            </div>
            <div className='flex-auto px-4 py-10 pt-0 lg:px-10'>
              <div className='mb-3 font-bold text-center text-gray-500'>
                <small>or with credentials</small>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='relative w-full mb-3'>
                  <label
                    className='block mb-2 text-xs font-bold text-gray-700 uppercase'
                    htmlFor='grid-password'
                  >
                    email
                  </label>
                  <input
                    type='email'
                    className='w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 bg-white border-0 rounded shadow focus:outline-none focus:ring'
                    placeholder='email'
                    style={{ transition: 'all .15s ease' }}
                    {...register('email', { required: true, minLength: 3, pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i })}
                  />
                  {errors.email && <div className='m-2 text-sm text-red-500'>enter a valid email</div>}
                </div>

                <div className='relative w-full mb-3'>
                  <label
                    className='block mb-2 text-xs font-bold text-gray-700 uppercase'
                    htmlFor='grid-password'
                  >
                    password
                  </label>
                  <input
                    type='password'
                    className='w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 bg-white border-0 rounded shadow focus:outline-none focus:ring'
                    placeholder='password'
                    style={{ transition: 'all .15s ease' }}
                    {...register('password', { required: true, minLength: 6 })}
                  />
                  {errors.password && <div className='m-2 text-sm text-red-500'>6+ characters required</div>}
                </div>

                <div className='mt-6 text-center'>
                  <button
                    className='w-full px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-gray-900 rounded shadow outline-none active:bg-gray-700 hover:shadow-lg focus:outline-none'
                    type='submit'
                    style={{ transition: 'all .15s ease' }}
                  >
                    {allowRecovery ? 'login' : 'sign up'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          {allowRecovery &&
            <div className='flex flex-wrap mt-6'>
              <div className='w-1/2'>
                <a
                  onClick={e => e.preventDefault()}
                  className='text-gray-300'
                >
                  <small>forgot password?</small>
                </a>
              </div>
            </div>}
        </div>
      </div>
    </div>

  )
}

export default LoginForm
