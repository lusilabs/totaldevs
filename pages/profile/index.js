import { useForm } from 'react-hook-form'
import { Button, Dropdown } from 'semantic-ui-react'
import React, { useState, useEffect, Component } from 'react'
import sleep from '@/utils/misc'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/utils/config'

import faker from 'faker'
import _ from 'lodash'
/*

- [ ] list of tech stack
- [ ] autopopulate fields
- [ ] downloadable pdf
- [ ]

 */

function EditDevProfile ({ userDoc, ...props }) {
  console.log({ userDoc })
  const [saving, setSaving] = useState(false)
  const [image, setImage] = useState(null)
  const [pdf, setPdf] = useState(null)

  const onSubmit = async data => {
    console.log(data)
    setSaving(true)
    await sleep(3000)
    setSaving(false)
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: userDoc
  })

  const handleUploadPhoto = e => {
    const file = e.target.files[0]
    const fileRef = ref(storage, `images/${file.name}`)
    uploadBytes(fileRef, file).then(snap => {
      getDownloadURL(fileRef).then(url => setImage(url))
    })
  }

  const handleUploadResume = e => {
    const file = e.target.files[0]
    const fileRef = ref(storage, `resumes/${file.name}`)
    uploadBytes(fileRef, file).then(snap => {
      getDownloadURL(fileRef).then(url => setPdf(url))
    })
  }

  console.log(watch(['displayName', 'title', 'bio', 'github-uri', 'linkedin-uri', 'website-uri', 'photoURL', 'visibility', 'job', 'resumeURL', 'terms']))

  const [state, setState] = useState({ searchQuery: '', value: [] })

  const handleChange = (e, { searchQuery, value }) => setState({ searchQuery, value })

  const handleSearchChange = (e, { searchQuery }) => setState({ searchQuery })

  const addressDefinitions = faker.definitions.address
  const stateOptions = _.map(addressDefinitions.state, (state, index) => ({
    key: addressDefinitions.state_abbr[index],
    text: state,
    value: addressDefinitions.state_abbr[index]
  }))

  return (
    <div className='m-4 md:col-span-2 shadow-xl'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='shadow overflow-hidden rounded-lg'>
          <div className='px-4 py-5 bg-white sm:p-6'>
            <div className='grid grid-cols-6 gap-6'>

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
                  {...register('displayName', { required: false, minLength: 3, pattern: /^[A-Za-z0-9 ]+$/i })}
                />
                {errors.name && <div className='m-2 text-sm text-red-500'>at least 3 chars</div>}
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                  title
                </label>
                <select
                  id='title'
                  name='title'
                  autoComplete='title-name'
                  disabled={props.sid}
                  className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700 ${props.sid ? 'bg-gray-100' : ''}`}
                  {...register('title', { required: false })}
                >
                  <option value='front-dev'>frontend dev</option>
                  <option value='front-eng'>frontend engineer</option>
                  <option value='back-dev'>backend dev</option>
                  <option value='back-eng'>backend engineer</option>
                  <option value='full-dev'>full stack dev</option>
                  <option value='full-eng'>full stack engineer</option>
                </select>
              </div>

              <div className='col-span-6 sm:col-span-6'>
                <label htmlFor='stack' className='block text-sm font-medium text-gray-700'>
                  tech stack
                </label>

                <Dropdown
                  fluid
                  multiple
                  onChange={handleChange}
                  onSearchChange={handleSearchChange}
                  options={stateOptions}
                  placeholder='technologies'
                  searchQuery={state.searchQuery}
                  value={state.value}
                  selection
                  search
                />
              </div>

              <div className='col-span-6 sm:col-span-6'>
                <label className='block text-sm font-medium text-gray-700'>profile picture</label>
                <div className='flex justify-center p-2'>
                  {image && <img src={image} alt={image} className='rounded-md shadow-lg' />}
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
                        htmlFor='photo'
                        className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
                      >
                        <span>upload</span>
                        <input type='file' id='photo' className='sr-only' {...register('photo', { required: false })} onChange={handleUploadPhoto} />
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
                    {...register('bio', { required: false, maxLength: 256, pattern: /^[A-Za-z0-9 ]+$/i })}
                  />
                </div>
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
                    {...register('github-uri', { required: false, maxLength: 256, pattern: /^[A-Za-z0-9 ]+$/i })}
                  />
                </div>
                {errors.price && <div className='m-2 text-sm text-red-500'>El precio necesita ser positivo</div>}
              </div>

              <div className='col-span-6 sm:col-span-2'>
                <label htmlFor='company-website' className='block text-sm font-medium text-gray-700'>
                  linkedIn uri
                </label>
                <div className='mt-1 flex rounded-md shadow-sm'>
                  <span className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'>
                    https://linkedin.com/
                  </span>
                  <input
                    type='text' name='company-website' id='company-website' className='focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300' placeholder=''
                    {...register('linkedin-uri', { required: false, maxLength: 256, pattern: /^[A-Za-z0-9 ]+$/i })}
                  />
                </div>
                {errors.price && <div className='m-2 text-sm text-red-500'>El precio necesita ser positivo</div>}
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
                    {...register('website-uri', { required: false, maxLength: 256, pattern: /^[A-Za-z0-9 ]+$/i })}
                  />
                </div>
                {errors.price && <div className='m-2 text-sm text-red-500'>El precio necesita ser positivo</div>}
              </div>
              <div className='col-span-6 sm:col-span-3 items-center'>
                <label htmlFor='visibility' className='block text-sm font-medium text-gray-700 p-2'>
                  profile visibility
                </label>
                <div className='flex flex-col'>

                  <div>
                    <input
                      {...register('visibility', { required: false })}
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
                      {...register('visibility', { required: false })}
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
                      {...register('job', { required: false })}
                      id='public'
                      name='job'
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
                      {...register('job', { required: false })}
                      id='private'
                      name='job'
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
                      {...register('job', { required: false })}
                      id='private'
                      name='job'
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

              <div className='col-span-6 sm:col-span-6'>
                <label className='block text-sm font-medium text-gray-700'>resumé</label>
                <div className='flex justify-center p-2'>
                  <div class='w-0 flex-1 flex items-center'>
                    <svg class='flex-shrink-0 h-5 w-5 text-gray-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                      <path fillRule='evenodd' d='M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z' clipRule='evenodd' />
                    </svg>
                    <span class='ml-2 flex-1 w-0 truncate'>
                      coverletter_back_end_developer.pdf
                    </span>
                  </div>
                  <div class='ml-4 flex-shrink-0'>
                    <a href='/resume' class='font-medium text-indigo-600 hover:text-indigo-500'>
                      download
                    </a>
                  </div>
                </div>
                {!pdf &&
                  <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
                    <div className='space-y-1 text-center'>

                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='mx-auto h-8 w-8 text-gray-400'
                        fill='none' viewBox='0 0 24 24' stroke='currentColor'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' />
                      </svg>
                      <div className='flex text-sm text-gray-600'>
                        <label
                          htmlFor='resume'
                          className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
                        >
                          <span>upload</span>
                          <input type='file' id='resume' className='sr-only' {...register('resume', { required: false })} onChange={handleUploadResume} />
                        </label>
                        <p className='pl-1'>or drag</p>
                      </div>
                      <p className='text-xs text-gray-500'>.pdf to 1MB</p>
                    </div>
                  </div>}
              </div>

              <div className='col-span-6 sm:col-span-6 items-center'>
                <label htmlFor='visibility' className='block text-sm font-medium text-gray-700 p-2'>
                  Terms and conditions
                </label>
                <div className='flex items-center justify-start'>

                  <div>
                    <input
                      {...register('terms', { required: false })}
                      id='public'
                      name='job'
                      type='radio'
                      value='public'
                      className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                    />
                    <label htmlFor='public' className='ml-2 text-md text-gray-700'>
                      I have read and agree to the <a href='/terms'> Privacy Policy </a> of totaldevs.com
                    </label>
                  </div>

                </div>
              </div>

            </div>
          </div>
          <div className='px-4 py-3 bg-gray-50 text-right sm:px-6 mb-8'>
            <Button disabled={saving} loading={saving} type='submit' color='green' fluid className='text-md'>
              {saving && <span>saving</span>}
              {!saving && <span>save</span>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditDevProfile
