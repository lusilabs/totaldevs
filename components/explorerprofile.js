import { useForm } from 'react-hook-form'
import { Button, Dropdown } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import sleep from '@/utils/misc'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage, db } from '@/utils/config'
import { doc, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import Link from 'next/link'
import ExplorerProfileDisplay from './explorerprofiledisplay'

export default function EditExplorerProfile ({ userDoc, ...props }) {
  const [saving, setSaving] = useState(false)
  const [photoURL, setPhotoURL] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setPhotoURL(userDoc.photoURL)
  }, [])

  const onSubmit = async data => {
    if (!photoURL) {
      toast.error('please upload a photo')
      return
    }
    setSaving(true)
    await sleep(2000)
    const uref = doc(db, 'users', userDoc.uid)
    const profileComplete = true
    await setDoc(uref, {
      displayName: data.displayName,
      bio: data.bio,
      hasAcceptedTerms: data.hasAcceptedTerms,
      profileComplete,
      photoURL
    }, { merge: true })
    // save to /profiles
    const pref = doc(db, 'profiles', userDoc.uid)
    await setDoc(pref, {
      displayName: data.displayName,
      bio: data.bio,
      profileComplete,
      photoURL
    }, { merge: true })
    toast.success('profile saved successfully.')
    setSaving(false)
    setIsEditing(false)
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      displayName: userDoc.displayName,
      bio: userDoc.bio,
      photoURL: userDoc.photoURL
    }
  })

  const handleUploadPhoto = e => {
    const file = e.target.files[0]
    const fileRef = ref(storage, `images/${file.name}`)
    if (!file.name.match(/.(jpg|jpeg|png|gif)$/i) || file.size > 1000000) {
      toast.error('Please upload a < 1 MB image.')
      return
    }
    uploadBytes(fileRef, file).then(_ => {
      getDownloadURL(fileRef).then(url => setPhotoURL(url))
    })
  }

  //   console.log(watch(['displayName', 'title', 'bio', 'githubURI', 'linkedInURI', 'websiteURL', 'photoURL', 'visibility', 'jobSearch', 'resumeURL', 'hasAcceptedTerms']))

  return (
    <>
      {!isEditing && <ExplorerProfileDisplay userDoc={userDoc} {...props} setIsEditing={setIsEditing} />}
      {isEditing && <div className='m-4 md:col-span-2 shadow-xl'>
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
                    {...register('displayName', { required: true, minLength: 3, pattern: /^[A-Za-z0-9 ]+$/i })}
                  />
                  {errors.name && <div className='m-2 text-sm text-red-500'>at least 3 chars</div>}
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
                      {...register('bio', { required: true, maxLength: 256, pattern: /^[A-Za-z0-9 ]+$/i })}
                    />
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
            </div>
            <div className='px-4 py-3 bg-gray-50 text-right sm:px-6 mb-8'>
              <Button disabled={saving} loading={saving} type='submit' color='green' fluid className='text-md'>
                {saving && <span>saving</span>}
                {!saving && <span>save</span>}
              </Button>
            </div>
          </div>
        </form>
      </div>}
    </>
  )
}
