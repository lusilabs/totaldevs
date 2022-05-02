import { useForm } from 'react-hook-form'
import { Button, Dropdown } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Assignments from '@/components/matches/assignments'
import { storage, db } from '@/utils/config'
import { useDocuments } from '@/utils/hooks'
import { doc, setDoc, addDoc, collection, getDoc, where } from 'firebase/firestore'
import { toast } from 'react-toastify'
import sleep from '@/utils/misc'
import { useRouter } from 'next/router'
import JobDisplay from '@/components/jobdisplay'

const Steps = [Step1, Step2, Step3]

function JobTypeForm ({ userDoc, setIsPageLoading, onSaveRoute, allowSkip, ...props }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const Component = Steps[step]
  const { register, handleSubmit, watch, getValues, formState: { errors }, reset } = useForm({ defaultValues: {} })

  console.log(watch(['position', 'avgSalary', 'stack']))

  const generateRandomPhoto = async () => {
    const unsplashURL = 'https://source.unsplash.com/random/300x300/?software'
    const { url } = await fetch(unsplashURL)
    return url
  }

  const onSubmit = async data => {
    setIsPageLoading(true)
    await sleep(1000)
    const jref = collection(db, 'jobs')
    const photoURL = await generateRandomPhoto()
    await addDoc(jref, {
      ...data,
      photoURL,
      uid: userDoc.uid,
      status: 'matching',
      companyName: userDoc.displayName,
      companyEmail: userDoc.email,
      company: userDoc.uid,
      createdAt: new Date().toISOString()
    })
    setIsPageLoading(false)
    if (onSaveRoute) {
      router.push(onSaveRoute)
      return
    }
    router.push('/jobs/?created=true')
  }

  const setNextStep = () => {
    const { position, stack } = getValues()
    if (step === 0) {
      if (!position) {
        errors.position = true
        return
      }
      errors.position = false
    }
    if (step === 1) {
      if (stack.length === 0) {
        errors.stack = true
        return
      }
      errors.stack = false
    }
    setStep(s => s + 1)
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          // className='flex flex-col justify-center m-8 align-center bg-fixed'
          className='absolute top-0 w-full h-full bg-center bg-cover justify-center flex items-center flex-col'
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/911738/pexels-photo-911738.jpeg')"
          }}
        >
          <Component register={register} errors={errors} userDoc={userDoc} setNextStep={setNextStep} />
          <div className='absolute bottom-20 right-20' onClick={() => setStep(s => s - 1)}>go back</div>
        </div>
      </form>
    </>
  )
}

function Step1 ({ userDoc, register, setNextStep, errors }) {
  return (

    <>
      <div>
        <label htmlFor='position' className='block mb-4 ml-4 font-medium text-gray-500'>
          what position is this?
        </label>
        <input
          // className='flex-1 block w-full border-gray-300 rounded-none focus:ring-indigo-500 focus:border-indigo-500 rounded-r-md sm:text-sm'
          autoFocus
          className='bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-600 '
          placeholder='type your answer here'
          type='text' name='position' id='position'
          {...register('position', { required: true, maxLength: 64 })}
        />
      </div>
      {errors.position && <div className='m-2 text-sm text-red-500'>this can't be blank</div>}
      <div className='flex items-center m-2'>
        <div className='block w-20'>
          <Button fluid compact primary onClick={setNextStep}>next</Button>
        </div>
        <div className='text-xs ml-4'>
          hit Enter ↵
        </div>
      </div>
    </>
  )
}

function Step2 ({ userDoc, register, errors, setStep }) {
  return (
    <>
      <div className='items-center content-start col-span-6 sm:col-span-3'>
        <label htmlFor='position' className='block p-2 text-sm font-medium text-gray-700'>
          what tech stack will the position be using?
        </label>

        <div className=' grid grid-cols-6 xl:grid-cols-12 gap-2 w-full'>
          <TechStackCard src='https://img.icons8.com/ios/50/000000/postgreesql.png' value='postgres' register={register} />
          <TechStackCard src='https://img.icons8.com/dotty/80/000000/react.png' value='react' register={register} />

        </div>

      </div>

      <Button onClick={() => setStep(s => s + 1)}>Next</Button>
    </>
  )
}

const TechStackCard = ({ src, value, register }) => {
  return (
    <div className='flex flex-col cursor-pointer shadow-md rounded-md bg-gray-100'>
      <label className='flex flex-col items-center'>
        <input
          {...register('stack', { required: true })}
          id={value}
          value={value}
          name='stack'
          type='checkbox'
          className='peer hidden'
        />
        <img src={src} className='cursor-pointer w-6 mt-2' />
        <span
          className='block text-xs cursor-pointer select-none rounded-md p-2 text-center peer-checked:text-blue-500'
        >
          {value}
        </span>
      </label>
    </div>
  )
}

function Step3 ({ userDoc, register }) {
  return (
    <>
      <div className='flex flex-col justify-center m-8 align-center'>
        <div className='col-span-6 sm:col-span-2'>
          <label htmlFor='salaryMin' className='block text-sm font-medium text-gray-700'>
            salaryMin
          </label>
          <div className='flex mt-1 rounded-md shadow-sm'>
            <input
              type='number'
              name='salaryMin'
              id='salaryMin'
              min='0'
              step='1'
              className='focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-14 pr-12 sm:text-sm border-gray-300 rounded-md shadow-sm'
              {...register('salaryMin', { required: true })}
            />
          </div>
        </div>
      </div>
      <Button type='submit'>submit</Button>
    </>
  )
}

export default JobTypeForm
