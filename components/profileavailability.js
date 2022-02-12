function ProfileAvailability ({ register, errors }) {
  return (
    <div className='shadow overflow-hidden rounded-lg p-4 sm:p-6 grid grid-cols-6 gap-6 m-4'>

      <div className='col-span-6 sm:col-span-6'>
        <label htmlFor='displayName' className='block text-sm font-medium text-gray-700'>
          <a href='https://calendly.com'>
            setup your calendly URL (https://calendly.com) so companies can schedule meetings with you.
          </a>
        </label>
        <input
          type='text'
          id='calendlyURL'
          name='calendlyURL'
          placeholder=''
          autoComplete='given-name'
          className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          {...register('calendlyURL', { required: true })}
        />
        {errors.calendlyURL && <div className='m-2 text-sm text-red-500'>please setup your calendar</div>}
      </div>

      <div className='col-span-6 sm:col-span-3'>
        <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
          desired position
        </label>
        <select
          id='title'
          name='title'
          autoComplete='title-name'
          className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700'
          {...register('title', { required: true })}
        >
          <option value='frontend developer'>frontend developer</option>
          <option value='frontend engineer'>frontend engineer</option>
          <option value='backend developer'>backend developer</option>
          <option value='backend engineer'>backend engineer</option>
          <option value='full stack developer'>full stack developer</option>
          <option value='full stack engineer'>full stack engineer</option>
          <option value='software architect'>software architect</option>
          <option value='tech lead'>tech lead</option>

          <option value='mobile developer'>mobile developer</option>
          <option value='android developer'>android developer</option>
          <option value='ios developer'>ios developer</option>

          <option value='designer'>designer</option>
          <option value='ui/ux engineer'>ui/ux engineer</option>

          <option value='machine learning engineer'>machine learning engineer</option>
          <option value='data engineer'>data engineer</option>
          <option value='data scientist'>data scientist</option>

          <option value='qa engineer'>qa engineer</option>
          <option value='security engineer'>security engineer</option>
          <option value='dev ops'>dev ops</option>

        </select>
      </div>

      <div className='col-span-6 sm:col-span-3 items-center content-start'>
        <label htmlFor='jobSearch' className='block text-sm font-medium text-gray-700 p-2'>
          job search
        </label>

        <div className='flex flex-col'>

          <div>
            <input
              {...register('jobSearch', { required: true })}
              id='public'
              name='jobSearch'
              type='radio'
              value='public'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='public' className='ml-2 text-md text-gray-700'>
              actively looking
            </label>
          </div>

          <div>
            <input
              {...register('jobSearch', { required: true })}
              id='private'
              name='jobSearch'
              type='radio'
              value='private'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='private' className='ml-2 text-md text-gray-700'>
              open to offers
            </label>
          </div>

          <div>
            <input
              {...register('jobSearch', { required: true })}
              id='private'
              name='jobSearch'
              type='radio'
              value='blocked'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='private' className='ml-2 text-md text-gray-700'>
              not interested
            </label>
          </div>

        </div>
      </div>

      <div className='col-span-6 sm:col-span-3'>
        <label htmlFor='salary' className='block text-sm font-medium text-gray-700'>
          desired min monthly salary or payment
        </label>
        <div className='mt-1 relative rounded-md shadow-sm'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <span className='text-gray-500 sm:text-sm'>USD$</span>
          </div>
          <input
            type='number'
            name='salaryMin'
            id='salaryMin'
            min='0'
            step='1'
            className='focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-14 pr-12 sm:text-sm border-gray-300 rounded-md shadow-sm '
            {...register('salaryMin', { required: true })}
          />
        </div>
        {errors.salaryMin && <div className='m-2 text-sm text-red-500'>min salary or payment cannot be null</div>}
      </div>

      <div className='col-span-6 sm:col-span-3'>
        <label htmlFor='salary' className='block text-sm font-medium text-gray-700'>
          (desired max monthly salary or payment)
        </label>
        <div className='mt-1 relative rounded-md shadow-sm'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <span className='text-gray-500 sm:text-sm'>USD$</span>
          </div>
          <input
            type='number'
            name='salaryMax'
            id='salaryMax'
            min='0'
            step='1'
            className='focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-14 pr-12 sm:text-sm border-gray-300 rounded-md shadow-sm '
            {...register('salaryMax', { required: false })}
          />
        </div>
      </div>

    </div>
  )
}

export default ProfileAvailability
