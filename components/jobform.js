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

const mergeSearchResults = (prev, names) => {
  const prevNames = prev.map(({ value }) => value)
  const dedupedNames = new Set([...prevNames, ...names])
  const deduped = [...dedupedNames].map(name => ({ key: name, value: name, text: name }))
  return deduped
}

function JobForm ({ userDoc, onSaveRoute, allowSkip, ...props }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [pdfURL, setPdfURL] = useState('')
  const [pdfName, setPdfName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [stack, setStack] = useState([])
  const [dropdownOptions, setDropdownOptions] = useState([])
  const [jobDoc, setJobDoc] = useState({})
  const [photoURL, setPhotoURL] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  const { jobID } = router.query
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({ defaultValues: jobDoc })
  const [matches, _ml, _mr, setMatches] = useDocuments({
    docs: 'matches',
    queryConstraints: [
      where('job', '==', jobID),
      where('status', '!=', 'waiting_on_dev')
    ]
  }, [jobID])

  useEffect(() => {
    if (Object.keys(jobDoc).length > 0) {
      setStack(jobDoc.stack ?? [])
      setDropdownOptions(jobDoc.stack?.map(name => ({ key: name, value: name, text: name })) ?? [])
      setPdfName(jobDoc.pdfName)
      setPdfURL(jobDoc.pdfURL)
      setPhotoURL(jobDoc.photoURL)
      reset(jobDoc) // this refires the defaultValues on the form to fill them up once the db data loads.
    }
  }, [jobDoc])

  useEffect(() => {
    const retrieveJob = async () => {
      const ref = doc(db, 'jobs', jobID)
      const d = await getDoc(ref)
      setJobDoc(d.data())
    }
    if (jobID) retrieveJob()
    else setIsEditing(true)
  }, [jobID])

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

  const generateRandomPhoto = async () => {
    const unsplashURL = 'https://source.unsplash.com/random/300x300/?software'
    const { url } = await fetch(unsplashURL)
    setPhotoURL(url)
    return url
  }

  const onSubmit = async data => {
    if (data.salaryMax && Number(data.salaryMax) < Number(data.salaryMin)) {
      toast.error('max salary cannot be smaller than min salary')
      return
    }
    setSaving(true)
    let url
    if (!photoURL) {
      url = await generateRandomPhoto()
      setPhotoURL(url)
    }
    await sleep(2000)
    if (jobID) {
      const jref = doc(db, 'jobs', jobID)
      await setDoc(jref, {
        title: data.title,
        stack,
        position: data.position,
        hours: data.hours,
        description: data.description,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        jobURL: data.jobURL,
        jobTitle: data.jobTitle,
        pdfURL,
        pdfName,
        photoURL: url,
        companyName: userDoc.displayName,
        companyEmail: userDoc.email,
        editedAt: new Date().toISOString()
      }, { merge: true })
    } else {
      const jref = collection(db, 'jobs')
      await addDoc(jref, {
        title: data.title,
        stack,
        position: data.position,
        hours: data.hours,
        description: data.description,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        jobURL: data.jobURL,
        jobTitle: data.jobTitle,
        pdfURL,
        pdfName,
        photoURL: photoURL ?? url,
        uid: userDoc.uid,
        status: 'matching',
        companyName: userDoc.displayName,
        companyEmail: userDoc.email,
        company: userDoc.uid,
        hasAcceptedTerms: data.hasAcceptedTerms,
        createdAt: new Date().toISOString()
      })
    }
    setSaving(false)
    if (onSaveRoute) {
      router.push(onSaveRoute)
      return
    }
    if (jobID) router.push('/jobs/?edited=true')
    else router.push('/jobs/?created=true')
  }

  const handleSearchChange = async (e, { searchQuery: query }) => setSearchQuery(query)
  const handleChange = (e, { value }) => setStack(value)
  const handleDropdownOnClose = (e, data) => setSearchQuery('')
  const fetchAndSetDropdownOptions = async url => {
    const response = await fetch(url)
    const { items } = await response.json()
    if (items && items.length > 0) setDropdownOptions(prev => mergeSearchResults(prev, items.map(({ name }) => name)))
  }
  useEffect(() => {
    const searchURL = `https://api.stackexchange.com/2.3/tags?pagesize=25&order=desc&sort=popular&inname=${searchQuery}&site=stackoverflow`
    const timer = setTimeout(() => {
      if (searchQuery !== '') fetchAndSetDropdownOptions(searchURL)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleUploadPDF = e => {
    const file = e.target.files[0]
    if (!file.type.includes('pdf') || file.size > 3000000) {
      toast.error('Please upload a < 3 MB pdf.')
      return
    }
    const fileRef = ref(storage, `pdfs/${file.name}-${Date.now()}`)
    uploadBytes(fileRef, file).then(_ => {
      getDownloadURL(fileRef).then(url => {
        setPdfURL(url)
        setPdfName(file.name)
      })
    })
  }
  // console.log(watch(['title', 'stack', 'position', 'hours', 'salary', 'description', 'jobURL', 'photoURL', 'extraDocs', 'terms']))
  return (
    <div className='m-4 md:col-span-2'>
      {!isEditing && <JobDisplay userDoc={userDoc} jobDoc={jobDoc} matches={matches} {...props} setIsEditing={setIsEditing} />}
      {isEditing && <><h2 className='text-center text-indigo-500'>{jobID && <span>re</span>} post your position for free 🚀</h2> <div className='text-center text-gray-500'> (fields in parentheses are optional) </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mt-4 overflow-hidden rounded-lg shadow'>
            <div className='px-4 py-5 bg-white sm:p-6'>
              <div className='grid grid-cols-6 gap-6'>
                <div className='col-span-6 sm:col-span-2'>
                  <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                    position
                  </label>
                  <select
                    id='title'
                    name='title'
                    autoComplete='title-name'
                    disabled={jobDoc.locked}
                    className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700 ${props.sid ? 'bg-gray-100' : ''}`}
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

                <div className='col-span-6 sm:col-span-2'>
                  <label htmlFor='company-website' className='block text-sm font-medium text-gray-700'>
                    (official job title)
                  </label>
                  <div className='flex mt-1 rounded-md shadow-sm'>
                    <input
                      type='text' name='company-website' id='company-website' className='flex-1 block w-full border-gray-300 rounded-none focus:ring-indigo-500 focus:border-indigo-500 rounded-r-md sm:text-sm' placeholder='e.g. support engineer'
                      {...register('jobTitle', { required: false, maxLength: 256 })}
                    />
                  </div>
                </div>

                <div className='col-span-6 sm:col-span-2'>
                  <label htmlFor='company-website' className='block text-sm font-medium text-gray-700'>
                    (job posting url)
                  </label>
                  <div className='flex mt-1 rounded-md shadow-sm'>
                    <span className='inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50'>
                      https://
                    </span>
                    <input
                      type='text' name='company-website' id='company-website' className='flex-1 block w-full border-gray-300 rounded-none focus:ring-indigo-500 focus:border-indigo-500 rounded-r-md sm:text-sm' placeholder='example.com'
                      {...register('jobURL', { required: false, maxLength: 256 })}
                    />
                  </div>
                </div>

                <div className='col-span-6 sm:col-span-6'>
                  <label htmlFor='stack' className='block text-sm font-medium text-gray-700'>
                    tech stack
                  </label>
                  <Dropdown
                    onChange={handleChange}
                    onClose={handleDropdownOnClose}
                    onSearchChange={handleSearchChange}
                    closeOnChange
                    options={dropdownOptions}
                    searchQuery={searchQuery}
                    value={stack}
                    fluid
                    multiple
                    selection
                    search
                    disabled={jobDoc.locked}
                  />
                </div>

                <div className='col-span-6'>
                  <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
                    (description)
                  </label>
                  <div className='mt-1'>
                    <textarea
                      id='description'
                      name='description'
                      rows={4}
                      className='block w-full mt-1 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
                      {...register('description', { required: false, maxLength: 4096 })}
                    />
                  </div>
                </div>

                <div className='items-center content-start col-span-6 sm:col-span-3'>
                  <label htmlFor='position' className='block p-2 text-sm font-medium text-gray-700'>
                    position
                  </label>
                  <div className='flex flex-col'>

                    <div>
                      <input
                        {...register('position', { required: true })}
                        id='public'
                        name='position'
                        type='radio'
                        value='public'
                        disabled={jobDoc.locked}
                        className='w-4 h-4 ml-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                      />
                      <label htmlFor='permanent' className='ml-2 text-gray-700 text-md'>
                        permanent
                      </label>
                    </div>

                    <div>
                      <input
                        {...register('position', { required: true })}
                        id='private'
                        name='position'
                        type='radio'
                        value='private'
                        disabled={jobDoc.locked}
                        className='w-4 h-4 ml-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                      />
                      <label htmlFor='one-time' className='ml-2 text-gray-700 text-md'>
                        one-time job
                      </label>
                    </div>

                    {errors.position && <div className='m-2 text-sm text-red-500'>select a type of position</div>}
                  </div>
                </div>

                <div className='items-center content-start col-span-6 sm:col-span-3'>
                  <label htmlFor='visibility' className='block p-2 text-sm font-medium text-gray-700'>
                    hours
                  </label>
                  <div className='flex flex-col'>
                    <div>
                      <input
                        {...register('hours', { required: true })}
                        id='public'
                        name='hours'
                        type='radio'
                        value='full-time'
                        disabled={jobDoc.locked}
                        className='w-4 h-4 ml-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                      />
                      <label htmlFor='full-time' className='ml-2 text-gray-700 text-md'>
                        full-time
                      </label>
                    </div>

                    <div>
                      <input
                        {...register('hours', { required: true })}
                        id='private'
                        name='hours'
                        type='radio'
                        value='half-time'
                        disabled={jobDoc.locked}
                        className='w-4 h-4 ml-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                      />
                      <label htmlFor='half-time' className='ml-2 text-gray-700 text-md'>
                        half-time
                      </label>
                    </div>

                    <div>
                      <input
                        {...register('hours', { required: true })}
                        id='private'
                        name='hours'
                        type='radio'
                        value='other'
                        disabled={jobDoc.locked}
                        className='w-4 h-4 ml-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                      />
                      <label htmlFor='other' className='ml-2 text-gray-700 text-md'>
                        other
                      </label>
                    </div>

                    {errors.hours && <div className='m-2 text-sm text-red-500'>select a type of working hours</div>}
                  </div>
                </div>

                <div className='col-span-6 sm:col-span-3'>
                  <label htmlFor='salary' className='block text-sm font-medium text-gray-700'>
                    min monthly salary or payment
                  </label>
                  <div className='relative mt-1 rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <span className='text-gray-500 sm:text-sm'>USD$</span>
                    </div>
                    <input
                      type='number'
                      name='salaryMin'
                      id='salaryMin'
                      min='0'
                      step='1'
                      className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-14 pr-12 sm:text-sm border-gray-300 rounded-md shadow-sm ${props.sid ? 'bg-gray-100' : ''}`}
                      disabled={jobDoc.locked}
                      {...register('salaryMin', { required: true })}
                    />
                  </div>
                  {errors.salaryMin && <div className='m-2 text-sm text-red-500'>min salary or payment cannot be null</div>}
                </div>

                <div className='col-span-6 sm:col-span-3'>
                  <label htmlFor='salary' className='block text-sm font-medium text-gray-700'>
                    (max monthly salary or payment)
                  </label>
                  <div className='relative mt-1 rounded-md shadow-sm'>
                    <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                      <span className='text-gray-500 sm:text-sm'>USD$</span>
                    </div>
                    <input
                      type='number'
                      name='salaryMax'
                      id='salaryMax'
                      min='0'
                      step='1'
                      className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-14 pr-12 sm:text-sm border-gray-300 rounded-md shadow-sm ${props.sid ? 'bg-gray-100' : ''}`}
                      disabled={jobDoc.locked}
                      {...register('salaryMax', { required: false })}
                    />
                  </div>
                </div>
                <div className='col-span-6 sm:col-span-6'>
                  <label className='block text-sm font-medium text-gray-700'>img (leave blank for random dev image)</label>
                  <div className='flex justify-center p-2'>
                    <img src={photoURL} alt={photoURL} className='shadow-lg rounded-md' />
                  </div>
                  <div className='flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md'>
                    <div className='text-center space-y-1'>
                      <svg
                        className='w-12 h-12 mx-auto text-gray-400'
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
                          className='relative font-medium text-indigo-600 bg-white cursor-pointer rounded-md hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
                        >
                          <span>upload an img</span>
                          <input type='file' id='photoURL' className='sr-only' {...register('photoURL', { required: false })} onChange={handleUploadPhoto} />
                        </label>
                        <p className='pl-1'>or drag</p>
                      </div>
                      <p className='text-xs text-gray-500'>.(png|jpg|gif) up to 1MB</p>
                    </div>
                  </div>
                  <div className='text-sm text-left text-indigo-600 sm:px-6'>
                    <span onClick={generateRandomPhoto}>or generate a random dev photo </span>
                  </div>
                </div>

                <div className='col-span-6 sm:col-span-6'>
                  <label className='block text-sm font-medium text-gray-700'>(extra docs)</label>
                  <div className='flex justify-center p-2'>
                    <div className='flex items-center flex-1 w-0'>
                      {pdfName && <> <svg className='flex-shrink-0 w-5 h-5 text-gray-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                        <path fillRule='evenodd' d='M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z' clipRule='evenodd' />
                      </svg>
                        <span className='ml-2 flex-1 w-0 truncate'>
                          {pdfName}
                        </span>

                        <div className='flex-shrink-0 ml-4'>
                          <a href={pdfURL} target='blank' className='font-medium text-indigo-600 hover:text-indigo-500' download={pdfName}>
                            download
                          </a>
                        </div>
                      </>}
                    </div>
                  </div>
                  <div className='flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md'>
                    <div className='text-center space-y-1'>

                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='w-8 h-8 mx-auto text-gray-400'
                        fill='none' viewBox='0 0 24 24' stroke='currentColor'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13' />
                      </svg>
                      <div className='flex text-sm text-gray-600'>
                        <label
                          htmlFor='pdfURL'
                          className='relative font-medium text-indigo-600 bg-white cursor-pointer rounded-md hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
                        >
                          <span>upload</span>
                          <input type='file' id='pdfURL' className='sr-only' {...register('pdfURL', { required: false })} onChange={handleUploadPDF} />
                        </label>
                        <p className='pl-1'>or drag</p>
                      </div>
                      <p className='text-xs text-gray-500'>.pdf up to 3MB</p>
                    </div>
                  </div>
                </div>

                <div className='items-center col-span-6 sm:col-span-6'>
                  <div className='flex items-center justify-start'>

                    <div>
                      <input
                        {...register('hasAcceptedTerms', { required: true })}
                        id='terms'
                        type='checkbox'
                        disabled={jobDoc.locked}
                        className='w-4 h-4 ml-1 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                      />
                      <label htmlFor='terms' className='ml-2 text-gray-700 text-md'>
                        I have read and agree to the <a href='/privacy'> Privacy Policy </a> of totaldevs.com
                      </label>
                      {errors.hasAcceptedTerms && <div className='m-2 text-sm text-red-500'>you must accept terms and conditions</div>}
                    </div>

                  </div>
                </div>

              </div>
            </div>
            <div className='px-4 py-3 mb-8 text-right bg-gray-50 sm:px-6'>
              <Button disabled={saving} loading={saving} type='submit' color='green' fluid className='text-md'>
                {saving && <span>posting...</span>}
                {!saving && <span>{jobID && <span>re</span>}post</span>}
              </Button>
            &nbsp;
              {/* {allowSkip && <Button disabled={saving} loading={saving} onClick={handleSkip} color='grey' fluid className='text-sm'>
              skip
            </Button>} */}
            </div>
          </div>
        </form>
      </>}
    </div>
  )
}

export default JobForm
