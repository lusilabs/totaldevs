import { useForm } from 'react-hook-form'
function LoginForm ({ handleProviderLogin, allowRecovery, handleEmailPasswordLogin }) {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm()
  const onSubmit = (data) => {
    handleEmailPasswordLogin(data.email, data.password)
  }
  return (
    <div className='container mx-auto px-4 h-full'>
      <div className='flex content-center items-center justify-center h-full'>
        <div className='w-full lg:w-4/12 px-4'>
          <div className='relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-300 border-0'>
            <div className='rounded-t mb-0 px-6 py-6'>
              <div className='text-center mb-3'>
                <h6 className='text-gray-600 text-sm font-bold'>
                  with
                </h6>
              </div>
              <div className='btn-wrapper text-center'>
                <button
                  className='bg-white active:bg-gray-100 text-gray-800 px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs'
                  type='button'
                  style={{ transition: 'all .15s ease' }}
                >
                  <img
                    alt='...'
                    className='w-5 mr-1'
                    src='/github.svg'
                  />
                  github
                </button>
                <button
                  className='bg-white active:bg-gray-100 text-gray-800 px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs'
                  type='button'
                  style={{ transition: 'all .15s ease' }}
                  onClick={handleProviderLogin}
                >
                  <img
                    alt='...'
                    className='w-5 mr-1'
                    src='/google.svg'
                  />
                  google
                </button>
              </div>
              <hr className='mt-6 border-b-1 border-gray-400' />
            </div>
            <div className='flex-auto px-4 lg:px-10 py-10 pt-0'>
              <div className='text-gray-500 text-center mb-3 font-bold'>
                <small>or with credentials</small>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='relative w-full mb-3'>
                  <label
                    className='block uppercase text-gray-700 text-xs font-bold mb-2'
                    htmlFor='grid-password'
                  >
                    email
                  </label>
                  <input
                    type='email'
                    className='border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full'
                    placeholder='email'
                    style={{ transition: 'all .15s ease' }}
                    {...register('email', { required: true, minLength: 3, pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i })}
                  />
                  {errors.email && <div className='m-2 text-sm text-red-500'>enter a valid email</div>}
                </div>

                <div className='relative w-full mb-3'>
                  <label
                    className='block uppercase text-gray-700 text-xs font-bold mb-2'
                    htmlFor='grid-password'
                  >
                    password
                  </label>
                  <input
                    type='password'
                    className='border-0 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full'
                    placeholder='password'
                    style={{ transition: 'all .15s ease' }}
                    {...register('password', { required: true, minLength: 6 })}
                  />
                  {errors.password && <div className='m-2 text-sm text-red-500'>6+ characters required</div>}
                </div>

                <div className='text-center mt-6'>
                  <button
                    className='bg-gray-900 text-white active:bg-gray-700 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full'
                    type='submit'
                    style={{ transition: 'all .15s ease' }}
                  >
                    login
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
