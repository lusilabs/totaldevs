import { useStackOverflowSearch } from '@/utils/hooks'
import { useEffect, useState } from 'react'
import CreateButton from '@/components/createbutton'
import { Dropdown } from 'semantic-ui-react'

const mergeSearchResults = (prev, names) => {
  const prevNames = prev.map(({ value }) => value)
  const dedupedNames = new Set([...prevNames, ...names])
  const deduped = [...dedupedNames].map(name => ({ key: name, value: name, text: name }))
  return deduped
}

export default function ProfileExperience({ jobs, setJobs }) {
  const [dropdownOptions, setDropdownOptions] = useState(jobs.map(j => j.stack?.map(name => ({ key: name, value: name, text: name })) ?? []))
  const [searchQuery, setSearchQuery] = useState(['', 0])

  const fetchAndSetDropdownOptions = async (url, ix) => {
    const response = await fetch(url)
    const { items } = await response.json()
    if (items && items.length > 0) {
      const dropdownOptionsClone = [...dropdownOptions]
      const prev = dropdownOptionsClone[ix]
      const next = mergeSearchResults(prev, items.map(({ name }) => name))
      dropdownOptionsClone[ix] = next
      setDropdownOptions(dropdownOptionsClone)
    }
  }

  useEffect(() => {
    const searchURL = `https://api.stackexchange.com/2.3/tags?pagesize=25&order=desc&sort=popular&inname=${searchQuery[0]}&site=stackoverflow`
    const timer = setTimeout(() => {
      if (searchQuery[0] !== '') fetchAndSetDropdownOptions(searchURL, searchQuery[1])
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleFieldChange = (e, ix, aix) => {
    const jobsClone = [...jobs]
    if (e.target.id === 'activity') {
      jobsClone[ix].activities[aix] = e.target.value
    } else {
      jobsClone[ix][e.target.id] = e.target.value
    }
    setJobs(jobsClone)
  }

  const handleAddNewJob = () => {
    setJobs(js => [...js, { stack: [], activities: [''] }])
    setDropdownOptions(p => [...p, []])
  }

  const handleRemoveJob = (e, ix) => {
    e.preventDefault()
    const jobsClone = [...jobs]
    jobsClone.splice(ix, 1)
    setJobs(jobsClone)
  }

  const handleAddNewActivity = (e, ix) => {
    e.preventDefault()
    const jobsClone = [...jobs]
    jobsClone[ix].activities = [...(jobsClone[ix].activities ?? []), '']
    setJobs(jobsClone)
  }

  const handleRemoveActivity = (e, jix, aix) => {
    e.preventDefault()
    const jobsClone = [...jobs]
    jobsClone[jix].activities.splice(aix, 1)
    setJobs(jobsClone)
  }

  const handleSearchChange = async (e, { searchQuery: query }, ix) => setSearchQuery([query, ix])
  const handleChange = (e, { value }, ix) => {
    const jobsClone = [...jobs]
    jobsClone[ix].stack = value
    setJobs(jobsClone)
  }

  return (
    <div>
      <div className='flex justify-between p-2'>
        <h3 className='text-gray-500 m-4 p-4'>jobs</h3>
        <CreateButton onClick={handleAddNewJob} text='+' extraClasses='bg-indigo-400 text-md' />
      </div>
      {jobs.length === 0 && <div className='text-red-400 text-lg shadow m-4 p-4 text-center'>no jobs registered, please add a job</div>}
      {jobs.length > 0 && jobs.map((j, ix) =>
        <div key={ix} className='relative m-4 p-4 md:m-6 md:p-6 rounded-lg overflow-hidden shadow grid grid-cols-6 gap-6 pb-12'>
          <div className='text-sm font-medium text-gray-500'>#{ix + 1}</div>
          <div className='col-span-6 sm:col-span-6'>
            <label htmlFor='stack' className='block text-sm font-medium text-gray-700'>
              tech stack used
            </label>
            <Dropdown
              options={dropdownOptions[ix] ?? []}
              onChange={(e, v) => handleChange(e, v, ix)}
              onSearchChange={(e, v) => handleSearchChange(e, v, ix)}
              searchQuery={searchQuery[0]}
              value={j.stack}
              fluid
              multiple
              selection
              search
            />
          </div>

          <div className='col-span-3 sm:col-span-1'>
            <label htmlFor='fromYear' className='block text-sm font-medium text-gray-700'>
              from year
            </label>
            <input
              type='text'
              id='fromYear'
              name='fromYear'
              placeholder=''
              autoComplete='given-fromYear'
              defaultValue={j.fromYear}
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <div className='col-span-3 m:col-span-1'>
            <label htmlFor='toYear' className='block text-sm font-medium text-gray-700'>
              to year
            </label>
            <input
              type='text'
              id='toYear'
              name='toYear'
              placeholder=''
              autoComplete='given-toYear'
              defaultValue={j.toYear}
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <div className='col-span-3 sm:col-span-2'>
            <label htmlFor='companyURL' className='block text-sm font-medium text-gray-700'>
              (company url)
            </label>
            <input
              type='text'
              id='companyURL'
              name='companyURL'
              placeholder=''
              autoComplete='given-companyURL'
              defaultValue={j.companyURL}
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <div className='col-span-3 sm:col-span-2'>
            <label htmlFor='role' className='block text-sm font-medium text-gray-700'>
              role
            </label>
            <input
              type='text'
              id='role'
              name='role'
              placeholder=''
              autoComplete='given-role'
              defaultValue={j.role}
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <div className='col-span-3 sm:col-span-2'>
            <label htmlFor='companyName' className='block text-sm font-medium text-gray-700'>
              company name
            </label>
            <input
              type='text'
              id='companyName'
              name='companyName'
              placeholder=''
              autoComplete='given-companyName'
              defaultValue={j.companyName}
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          {((j.activities && j.activities.length === 0) || !j.activities) && <div className='col-span-6 text-sm text-red-400'>(please add activities)</div>}
          {j.activities && j.activities.length > 0 && j.activities.map((a, aix) =>
            <div className='col-span-6' key={aix}>
              <label htmlFor='toYear' className='block text-sm font-medium text-gray-700'>
                description of activity {aix + 1}
              </label>
              <textarea
                id='activity'
                name='activity'
                rows={3}
                onChange={e => handleFieldChange(e, ix, aix)}
                defaultValue={j.activities[aix]}
                className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
              />
              <button
                onClick={e => handleRemoveActivity(e, ix, aix)}
                className='bg-red-200 h-6 px-4 rounded-full'
              >-
              </button>
            </div>)}

          <button
            onClick={e => handleRemoveJob(e, ix)}
            className='bg-red-200 h-6 px-4 absolute bottom-2 left-2 rounded-full'
          >remove
          </button>

          <button
            onClick={e => handleAddNewActivity(e, ix)}
            className='absolute right-2 bottom-2 lg:bottom-8 lg:right-4 text-md cursor-hover text-white px-4 rounded-md w-auto h-6 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none bg-indigo-400'
          >
            <span>+</span>
          </button>

        </div>
      )}

    </div>
  )
}
