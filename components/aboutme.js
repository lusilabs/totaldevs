import Link from 'next/link'
// bio || default bio
// phone
// github
// urls
// current role
// salary expectations
export default function AboutMe ({ register, errors, saving, photoURL, handleUploadPhoto }) {
  return (
    <div className='shadow overflow-hidden rounded-lg p-4 sm:p-6 grid grid-cols-6 gap-6'>

      <div className='col-span-6 sm:col-span-3'>
        <label htmlFor='displayName' className='block text-sm font-medium text-gray-700'>
          name
        </label>
        <input
          type='text'
          id='displayName'
          name='displayName'
          placeholder=''
          autoComplete='given-name'
          className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          {...register('displayName', { required: true, minLength: 3 })}
        />
        {errors.name && <div className='m-2 text-sm text-red-500'>at least 3 chars</div>}
      </div>

      <div className='col-span-6 sm:col-span-3'>
        <label htmlFor='displayName' className='block text-sm font-medium text-gray-700'>
          (phone)
        </label>
        <input
          type='text'
          id='phone'
          name='phone'
          placeholder=''
          autoComplete='given-name'
          className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          {...register('phone', { required: false, minLength: 8 })}
        />
        {errors.phone && <div className='m-2 text-sm text-red-500'>min 8 chars</div>}
      </div>

      <div className='col-span-6 sm:col-span-3'>
        <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
          title
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

      <div className='col-span-6 sm:col-span-6 items-center'>
        <label htmlFor='english' className='block text-sm font-medium text-gray-700 p-2'>
          english level
        </label>
        <div className='flex flex-col'>

          <div>
            <input
              {...register('englishLevel', { required: true })}
              id='public'
              name='englishLevel'
              type='radio'
              value='basic'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='public' className='ml-2 text-md text-gray-700'>
              basic
            </label>
            <span className='ml-4 text-xs'>
              (I can write well but verbal communnication is slow)
            </span>
          </div>

          <div>
            <input
              {...register('englishLevel', { required: true })}
              id='private'
              name='englishLevel'
              type='radio'
              value='average'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='private' className='ml-2 text-md text-gray-700'>
              average
            </label>
            <span className='ml-4 text-xs'>
              (I can communnicate with my manager and other team members without repeating too much)
            </span>
          </div>

          <div>
            <input
              {...register('englishLevel', { required: true })}
              id='private'
              name='englishLevel'
              type='radio'
              value='great'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='private' className='ml-2 text-md text-gray-700'>
              great
            </label>
            <span className='ml-4 text-xs'>
              (english-speaking managers and I can easily understand each other)
            </span>
          </div>

        </div>
      </div>

      <div className='col-span-6 sm:col-span-6'>
        <label className='block text-sm font-medium text-gray-700'>(300x300 professional profile picture) </label>
        <div className='flex justify-center p-2'>
          {photoURL && <img src={photoURL} alt={photoURL} className='rounded-md shadow-lg' />}
        </div>
        <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
          <div className='space-y-1 text-center'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
              stroke='currentColor'
              fill='none'
              viewBox='0 0 48 48'
              aria-hidden='true'
            >
              <path
                d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <div className='flex text-sm text-gray-600'>
              <label
                htmlFor='photoURL'
                className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
              >
                <span>upload</span>
                <input type='file' id='photoURL' className='sr-only' {...register('photoURL', { required: false })} onChange={handleUploadPhoto} />
              </label>
              <p className='pl-1'>or drag</p>
            </div>
            <p className='text-xs text-gray-500'>.(png|jpg|gif) up to 1MB</p>
          </div>
        </div>
      </div>

      <div className='col-span-6'>
        <label htmlFor='bio' className='block text-sm font-medium text-gray-700'>
          about me
        </label>
        <div className='mt-1'>
          <textarea
            id='bio'
            name='bio'
            rows={3}
            className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
            {...register('bio', { required: true, maxLength: 4096 })}
          />
        </div>
        {errors.bio && <div className='m-2 text-sm text-red-500'>at most 4096 chars</div>}
      </div>

      <div className='col-span-6 sm:col-span-2'>
        <label htmlFor='company-website' className='block text-sm font-medium text-gray-700'>
          github profile uri
        </label>
        <div className='mt-1 flex rounded-md shadow-sm'>
          <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
            https://github.com/
          </span>
          <input
            type='text' name='company-website' id='company-website' className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300' placeholder=''
            {...register('githubURI', { required: false, maxLength: 256 })}
          />
        </div>
      </div>

      <div className='col-span-6 sm:col-span-2'>
        <label htmlFor='company-website' className='block text-sm font-medium text-gray-700'>
          linkedIn uri
        </label>
        <div className='mt-1 flex rounded-md shadow-sm'>
          <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
            https://linkedin.com/in/
          </span>
          <input
            type='text' name='company-website' id='company-website' className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300' placeholder=''
            {...register('linkedInURI', { required: false, maxLength: 256 })}
          />
        </div>
      </div>

      <div className='col-span-6 sm:col-span-2'>
        <label htmlFor='company-website' className='block text-sm font-medium text-gray-700'>
          website url
        </label>
        <div className='mt-1 flex rounded-md shadow-sm'>
          <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
            https://
          </span>
          <input
            type='text' name='company-website' id='company-website' className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300' placeholder='example.com'
            {...register('websiteURL', { required: false, maxLength: 256 })}
          />
        </div>
      </div>

      <div className='col-span-6 sm:col-span-3'>
        <label htmlFor='displayName' className='block text-sm font-medium text-gray-700'>
          years experience
        </label>
        <input
          type='number'
          id='experienceYears'
          name='experienceYears'
          placeholder=''
          autoComplete='given-name'
          className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          {...register('experienceYears', { required: true, pattern: /^[0-9 ]+$/i })}
        />
        {errors.experienceYears && <div className='m-2 text-sm text-red-500'>required</div>}
      </div>

      <div className='col-span-6 sm:col-span-3'>
        <label htmlFor='displayName' className='block text-sm font-medium text-gray-700'>
          years remote experience
        </label>
        <input
          type='number'
          id='remoteExperienceYears'
          name='remoteExperienceYears'
          placeholder=''
          autoComplete='given-name'
          className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
          {...register('remoteExperienceYears', { required: true, pattern: /^[0-9 ]+$/i })}
        />
        {errors.remoteExperienceYears && <div className='m-2 text-sm text-red-500'>required</div>}
      </div>

      <div className='col-span-6 sm:col-span-3 items-center'>
        <label htmlFor='visibility' className='block text-sm font-medium text-gray-700 p-2'>
          landing page visibility
        </label>
        <div className='flex flex-col'>

          <div>
            <input
              {...register('visibility', { required: true })}
              id='public'
              name='visibility'
              type='radio'
              value='public'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='public' className='ml-2 text-md text-gray-700'>
              public
            </label>
          </div>

          <div>
            <input
              {...register('visibility', { required: true })}
              id='private'
              name='visibility'
              type='radio'
              value='private'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='private' className='ml-2 text-md text-gray-700'>
              private
            </label>
          </div>

        </div>

      </div>

      <div className='col-span-6 sm:col-span-3 items-center content-start'>
        <label htmlFor='visibility' className='block text-sm font-medium text-gray-700 p-2'>
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
              value='private'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='private' className='ml-2 text-md text-gray-700'>
              not interested
            </label>
          </div>

        </div>
      </div>

      <div className='col-span-6 sm:col-span-6 items-center'>
        <label htmlFor='terms' className='block text-sm font-medium text-gray-700 p-2'>
          terms and conditions
        </label>
        <div className='flex items-center justify-start'>

          <div>
            <input
              {...register('hasAcceptedTerms', { required: true })}
              id='terms'
              type='checkbox'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <label htmlFor='terms' className='ml-2 text-md text-gray-700'>
              I have read and agree to the <Link href='/terms'><a> Privacy Policy </a></Link>  of totaldevs.com
            </label>
          </div>

        </div>
      </div>

    </div>
  )
}
