import { useForm } from 'react-hook-form'
import { Button } from 'semantic-ui-react'
import React, { useState } from 'react'
import { db } from '@/utils/config'
import { doc, setDoc, addDoc, increment, collection, getDoc } from 'firebase/firestore'
import router from 'next/router'
import { toast } from 'react-toastify'

function AddInvite ({ userDoc, ...props }) {
  const [saving, setSaving] = useState(false)

  const onSubmit = async data => {
    setSaving(true)
    const ref = doc(db, 'invites', `${data.email}:dev`)
    const d = await getDoc(ref)
    if (d.exists()) {
      toast.error('that email has already been invited')
      setSaving(false)
      return
    }
    await setDoc(ref, {
      text: data.inviteText,
      referrer: userDoc.email,
      referrerID: userDoc.uid,
      redeemed: false,
      createdAt: new Date().toISOString()
    }, { merge: true })
    const mref = collection(db, 'mail')
    await addDoc(mref, {
      message: {
        text: data.inviteText,
        subject: 'Congratulations! 🎉🎉 you have been invited to join totaldevs.com'
      },
      to: [data.email],
      createdAt: new Date().toISOString()
    })
    await setDoc(ref, {
      text: data.inviteText,
      referrer: userDoc.email,
      referrerID: userDoc.uid,
      isActive: false,
      role: 'dev',
      redeemed: false,
      usd: 0,
      createdAt: new Date().toISOString()
    }, { merge: true })
    const uref = doc(db, 'users', userDoc.uid)
    await setDoc(uref, {
      numInvitesLeft: increment(-1)
    }, { merge: true })
    setSaving(false)
    router.push('/invites?created=true')
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      inviteText: 'join https://totaldevs.com with me and we will shoot for the stars together! 🚀 the easiest way to get a developer job at an international company.'
    }
  })

  // console.log(watch(['email', 'inviteText']))

  return (
    <div className='m-4 md:col-span-2 shadow-xl'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='shadow overflow-hidden rounded-lg'>
          <div className='px-4 py-5 bg-white sm:p-6'>
            <div className='grid grid-cols-6 gap-6'>

              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  email
                </label>
                <input
                  type='text'
                  id='email'
                  name='email'
                  className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                  {...register('email', { required: true, minLength: 3, pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i })}
                />
                {errors.email && <div className='m-2 text-sm text-red-500'>a valid email is required</div>}
              </div>

              <div className='col-span-6'>
                <label htmlFor='inviteText' className='block text-sm font-medium text-gray-700'>
                  write something to them
                </label>
                <div className='mt-1'>
                  <textarea
                    id='inviteText'
                    name='inviteText'
                    rows={3}
                    className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
                    {...register('inviteText', { required: false, maxLength: 512 })}
                  />
                  {errors.inviteText && <div className='m-2 text-sm text-red-500'>invalid characters detected</div>}
                </div>
              </div>

            </div>
          </div>
          <div className='px-4 py-3 bg-gray-50 text-right sm:px-6 mb-8'>
            <Button disabled={saving} loading={saving} type='submit' color='green' fluid className='text-md'>
              {saving && <span>sending...</span>}
              {!saving && <span>send</span>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AddInvite
