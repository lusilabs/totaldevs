import { useForm } from 'react-hook-form'
import { Button, Dropdown } from 'semantic-ui-react'
import React, { useState, useEffect } from 'react'
import { db } from '@/utils/config'
import { addDoc, collection } from 'firebase/firestore'
import sleep from '@/utils/misc'
import { useRouter } from 'next/router'

const backgroundURL = 'https://images.unsplash.com/photo-1524685364536-a6f820f6c5ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80'

const defaultTechnologies = [
  { src: 'https://img.icons8.com/office/50/000000/react.png', value: 'react' },
  { src: 'https://img.icons8.com/color/50/000000/vue-js.png', value: 'vue' },
  { src: 'https://img.icons8.com/color/50/000000/angularjs.png', value: 'angular' },
  { src: 'https://img.icons8.com/fluency/50/000000/laravel.png', value: 'laravel' },
  { src: 'https://img.icons8.com/color/50/000000/angularjs.png', value: 'angularjs' },
  { src: 'https://img.icons8.com/windows/50/000000/ruby-on-rails.png', value: 'rails' },
  { src: 'https://img.icons8.com/ios-filled/50/000000/jquery.png', value: 'jQuery' },
  { src: 'https://img.icons8.com/external-tal-revivo-color-tal-revivo/50/000000/external-net-or-dot-net-a-software-framework-developed-by-microsoft-logo-color-tal-revivo.png', value: '.net' },

  { src: 'https://img.icons8.com/color/50/000000/python.png', value: 'python' },
  { src: 'https://img.icons8.com/color/50/000000/java-coffee-cup-logo--v1.png"', value: 'java' },
  { src: 'https://img.icons8.com/officel/50/000000/php-logo.png', value: 'php' },
  { src: 'https://img.icons8.com/color/50/000000/golang.png', value: 'go' },
  { src: 'https://img.icons8.com/color/50/000000/swift.png', value: 'swift' },
  { src: 'https://img.icons8.com/color/50/000000/c-sharp-logo.png', value: 'C#' },
  { src: 'https://img.icons8.com/color/50/000000/typescript.png', value: 'typescript' },

  { src: 'https://img.icons8.com/dusk/50/000000/database.png', value: 'sql' },
  { src: 'https://img.icons8.com/fluency/50/000000/database.png', value: 'no sql' },
  { src: 'https://img.icons8.com/color/50/000000/kubernetes.png', value: 'k8s' },
  { src: 'https://img.icons8.com/color/50/000000/docker.png', value: 'docker' },
  { src: 'https://img.icons8.com/color/50/000000/terraform.png', value: 'terraform' },
  { src: 'https://img.icons8.com/color/50/000000/amazon-web-services.png', value: 'aws' },
  { src: 'https://img.icons8.com/color/50/000000/google-cloud-platform.png', value: 'gcp' },
  { src: 'https://img.icons8.com/color/50/000000/azure-1.png', value: 'azure' },
  { src: 'https://img.icons8.com/windows/32/000000/digital-ocean.png', value: 'digital ocean' }
]

const Steps = [Step1, Step2, Step3]

const mergeSearchResults = (prev, names) => {
  const prevNames = prev.map(({ value }) => value)
  const dedupedNames = new Set([...prevNames, ...names])
  const deduped = [...dedupedNames].map(name => ({ key: name, value: name, text: name }))
  return deduped
}

function JobTypeForm({ userDoc, setIsPageLoading, onSaveRoute, allowSkip, ...props }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [stack, setStack] = useState([])
  const Component = Steps[step]
  const { register, handleSubmit, watch, getValues, setValue, formState: { errors }, trigger, setError } = useForm()
  console.log(watch(['position', 'stack', 'avgSalary']))

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
    data.stack = [...(new Set([...(data.stack || []), ...stack]))]
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

  const setNextStep = async (e, dropdownStack) => {
    e && e.preventDefault()
    const { position, stack } = getValues()
    console.log({ stack, step, position, errors })
    if (step === 0) {
      const pos = await trigger('position')
      if (!pos) return
    }
    if (step === 1) {
      if ((!stack && !dropdownStack) || (stack.length === 0 && dropdownStack.length === 0)) {
        setError('stack', { type: 'custom', message: 'stack is empty' })
        return
      }
    }
    setStep(s => s + 1)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className='absolute top-0 w-full h-full bg-center bg-cover justify-center flex items-center flex-col'
          style={{
            backgroundImage: `url('${backgroundURL}')`
          }}
        >
          <Component
            register={register}
            errors={errors}
            stack={stack}
            setStack={setStack}
            setValue={setValue}
            setNextStep={setNextStep}
          />
          {step > 0 && <div className='absolute bottom-20 right-20 cursor-pointer' onClick={() => setStep(s => s - 1)}>go back</div>}
        </div>
      </form>
    </>
  )
}

function Step1({ register, setNextStep, errors }) {
  return (
    <>
      <div>
        <label htmlFor='position' className='block mb-4 ml-4 font-medium'>
          what position is this?
        </label>
        <input
          autoFocus
          className='bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-600 '
          placeholder='e.g. frontend engineer'
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

function Step2({ register, errors, setNextStep, stack, setStack }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOptions, setDropdownOptions] = useState([])

  useEffect(() => {
    const onEnter = e => e.key === 'Enter' ? setNextStep() : null
    document.addEventListener('keydown', onEnter)
    return () => document.removeEventListener('keydown', onEnter)
  }, [])

  const fetchAndSetDropdownOptions = async url => {
    const response = await fetch(url)
    const { items } = await response.json()
    if (items && items.length > 0) setDropdownOptions(prev => mergeSearchResults(prev, items.map(({ name }) => name)))
  }
  const handleSearchChange = async (e, { searchQuery: query }) => setSearchQuery(query)
  console.log({ stack })
  const handleDropdownChange = (e, { value }) => setStack(value)
  const handleDropdownOnClose = (e, data) => setSearchQuery('')

  useEffect(() => {
    const searchURL = `https://api.stackexchange.com/2.3/tags?pagesize=25&order=desc&sort=popular&inname=${searchQuery}&site=stackoverflow`
    const timer = setTimeout(() => {
      if (searchQuery !== '') fetchAndSetDropdownOptions(searchURL)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <>
      <div className='items-center content-start'>
        <label htmlFor='position' className='block p-2 text-sm font-medium'>
          what technologies will the position be using?
        </label>
        <div className='w-full grid gap-1 grid-cols-3 md:grid-cols-8'>
          {defaultTechnologies.map((t, ix) => (<TechStackCard key={ix} src={t.src} value={t.value} register={register} />))}
        </div>
        {errors.stack && <div className='m-2 text-sm text-red-500'>select at least 1 tech</div>}
        <span className='text-gray-700 mt-4 block'>
          not among those? try searching for it
        </span>
        <Dropdown
          onChange={handleDropdownChange}
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
        />
      </div>
      <div className='flex items-center m-2'>
        <div className='block w-20'>
          <Button fluid compact primary onClick={e => setNextStep(e, stack)}>next</Button>
        </div>
        <div className='text-xs ml-4'>
          hit Enter ↵
        </div>
      </div>
    </>
  )
}

const SENIORITIES = [
  { name: 'junior', src: 'https://img.icons8.com/external-ddara-lineal-color-ddara/64/000000/external-hipster-user-avatar-ddara-lineal-color-ddara.png', avgSalary: 20_000.00, description: 'needs constant guidance' },
  { name: 'midlevel', src: 'https://img.icons8.com/external-filled-outline-icons-maxicons/85/000000/external-avatar-avatar-filled-outline-filled-outline-icons-maxicons-14.png', avgSalary: 35_000.00, description: 'can mostly work on their own' },
  { name: 'senior', src: 'https://img.icons8.com/external-itim2101-lineal-color-itim2101/64/000000/external-hipster-avatar-itim2101-lineal-color-itim2101.png', avgSalary: 60_000.00, description: 'can lead and mentor others' }
]

function Step3({ register, errors, setValue }) {
  const [seniorityDescription, setSeniorityDescription] = useState('select any experience level')
  const selectSeniority = sr => {
    setValue('avgSalary', sr.avgSalary)
    setSeniorityDescription(sr.description)
  }
  return (
    <>
      <div>
        <label htmlFor='avgSalary' className='block text-sm font-medium text-gray-700'>
          <div>
            what is the average annual salary in USD?
          </div>
          <div className='w-full grid gap-1 grid-cols-3 m-2'>
            {SENIORITIES.map((sr, ix) => <SeniorityCard sr={sr} selectSeniority={selectSeniority} />)}
          </div>
          {seniorityDescription && <> <span className='text-indigo-600'>{seniorityDescription}</span> </>}
        </label>

        <input
          autoFocus
          className='bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-indigo-600 w-full'
          placeholder='click any button to estimate'
          type='text'
          name='avgSalary'
          id='avgSalary'
          required
          {...register('avgSalary', { required: true, maxLength: 24 })}
        />
        {seniorityDescription &&
          <div className='text-xs'>
            (charged a monthly equivalent once they pass a trial period)
          </div>}

      </div>
      {errors.avgSalary && <div className='m-2 text-sm text-red-500'>this can't be blank</div>}
      <div className='flex items-center m-2'>
        <div className='block w-20'>
          <Button fluid compact primary type='submit'>submit</Button>
        </div>
        <div className='text-xs ml-4'>
          hit Enter ↵
        </div>
      </div>
    </>
  )
}

const SeniorityCard = ({ sr, selectSeniority }) => {
  return (
    <div key={sr.name} className='flex flex-col cursor-pointer shadow-md rounded-md bg-gray-100'>
      <label
        className='flex flex-col items-center'
      >
        <input
          name='seniority'
          type='radio'
          className='peer hidden'
          onChange={() => selectSeniority(sr)}
        />
        <img src={sr.src} className='cursor-pointer w-10 mt-2 grayscale peer-checked:grayscale-0' />
        <span
          className='block text-xs cursor-pointer select-none rounded-md p-2 text-center peer-checked:text-blue-500'
        >
          {sr.name}
        </span>
      </label>
    </div>
  )
}

const TechStackCard = ({ src, value, register }) => {
  return (
    <div className='flex flex-col cursor-pointer shadow-md rounded-md bg-gray-100'>
      <label className='flex flex-col items-center'>
        <input
          {...register('stack')}
          id={value}
          value={value}
          name='stack'
          type='checkbox'
          className='peer hidden'
        />
        <img src={src} className='cursor-pointer w-4 md:w-8 mt-2 grayscale peer-checked:grayscale-0' />
        <span
          className='block text-xs cursor-pointer select-none rounded-md p-2 text-center peer-checked:text-blue-500'
        >
          {value}
        </span>
      </label>
    </div>
  )
}

export default JobTypeForm
