import { useForm } from 'react-hook-form'
import { Button } from 'semantic-ui-react'
import React, { useState } from 'react'
import { db } from '@/utils/config'
import { doc, setDoc, addDoc, increment, collection, getDoc } from 'firebase/firestore'
import router from 'next/router'
import { toast } from 'react-toastify'

function AddInvite ({ userDoc, ...props }) {
  const [saving, setSaving] = useState(false)
  const [position, setPosition] = useState('')
  const [textArea, setTextArea] = useState('Hi, we noticed you had an open position, we might have the perfect fit for you. Have you considered hiring talent from Latin America and saving up to 50% with proven results? We at totaldevs have pre-screened and mentored talent from an exclusive professional developer community ready to deliver work. Open up a free job posting at https://totaldevs.com, the process is completely streamlined and hassle-free. We handle all the difficult paperwork and process the payment for the devs. Questions? book a 15min meeting https://calendly.com/carlo-totaldevs/15min')

  const onSubmit = async data => {
    setSaving(true)
    const ref = doc(db, 'invites', `${data.email}:company`)
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
        subject: 'Have you considered recruiting talent from Latin America? 🤔'
      },
      to: [data.email],
      createdAt: new Date().toISOString()
    })
    await setDoc(ref, {
      text: data.inviteText,
      referrer: userDoc.email,
      referrerID: userDoc.uid,
      isActive: false,
      redeemed: false,
      usd: 0,
      createdAt: new Date().toISOString()
    }, { merge: true })
    setSaving(false)
    router.push('/invites?created=true')
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      inviteText: textArea
    }
  })

  // console.log(watch(['email', 'inviteText']))
  const handlePositionChange = e => {
    setPosition(e.target.value)
    setTextArea(`Hi, we noticed you had an open position for a ${e.target.value}, we might have the perfect fit for you. Have you considered hiring talent from Latin America and saving up to 50% with proven results? We at totaldevs have pre-screened and mentored talent from an exclusive professional developer community ready to deliver work. Open up a free job posting at https://totaldevs.com, the process is completely streamlined and hassle-free. We handle all the difficult paperwork and process the payment for the devs. Questions? book a 15min meeting https://calendly.com/carlo-totaldevs/15min`)
  }

  const handleTextAreaChange = e => {
    setTextArea(e.target.value)
  }

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

              <div className='col-span-6 sm:col-span-3'>
                <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                  (title)
                </label>
                <select
                  id='title'
                  name='title'
                  autoComplete='title-name'
                  onChange={handlePositionChange}
                  className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700 ${props.sid ? 'bg-gray-100' : ''}`}
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

              <div className='col-span-6'>
                <label htmlFor='inviteText' className='block text-sm font-medium text-gray-700'>
                  write something to them
                </label>
                <div className='mt-1'>
                  <textarea
                    id='inviteText'
                    name='inviteText'
                    rows={8}
                    value={textArea}
                    className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
                    {...register('inviteText', { required: false, maxLength: 1024, onChange: handleTextAreaChange })}
                  />
                  {errors.inviteText && <div className='m-2 text-sm text-red-500'>invalid characters detected or max num chars 1024 exceeded.</div>}
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
