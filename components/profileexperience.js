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

export default function ProfileExperience ({ jobs, setJobs }) {
  const [dropdownOptions, setDropdownOptions] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleFieldChange = (e, ix) => {
    const jobsClone = [...jobs]
    jobsClone[ix][e.target.id] = e.target.value
    setJobs(jobsClone)
  }
  const handleAddNewJob = () => setJobs(js => [...js, { stack: [], activities: [''] }])
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

  const handleSearchChange = async (e, { searchQuery: query }, ix) => setSearchQuery(query)
  const handleChange = (e, { value }, ix) => {
    const jobsClone = [...jobs]
    jobsClone[ix].stack = value
    setJobs(jobsClone)
  }

  return (
    <div>
      <h3 className='text-gray-500 m-4 p-4'>jobs</h3>

      {jobs.length === 0 && <div className='text-red-400 text-lg shadow m-4 p-4 text-center'>no jobs registered, please add a job</div>}
      {jobs.length > 0 && jobs.map((j, ix) =>

        <div key={ix} className='relative m-4 p-4 md:m-6 md:p-6 rounded-lg overflow-hidden shadow grid grid-cols-6 gap-6 pb-12'>
          <div className='col-span-6 sm:col-span-6'>
            <label htmlFor='stack' className='block text-sm font-medium text-gray-700'>
              tech stack used
            </label>
            <Dropdown
              options={dropdownOptions}
              onChange={(e, v) => handleChange(e, v, ix)}
              onSearchChange={(e, v) => handleSearchChange(e, v, ix)}
              searchQuery={searchQuery}
              value={jobs[ix].stack}
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
              defaultValue={jobs[ix].fromYear}
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
              defaultValue={jobs[ix].toYear}
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
              defaultValue={jobs[ix].companyURL}
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
              defaultValue={jobs[ix].role}
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
              defaultValue={jobs[ix].companyName}
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          {((jobs[ix].activities && jobs[ix].activities.length === 0) || !jobs[ix].activities) && <div className='col-span-6 text-sm text-red-400'>(please add activities)</div>}
          {jobs[ix].activities && jobs[ix].activities.length > 0 && jobs[ix].activities.map((a, aix) =>
            <div className='col-span-6' key={aix}>
              <label htmlFor='toYear' className='block text-sm font-medium text-gray-700'>
                description of activity {aix + 1}
              </label>
              <textarea
                id='activity1'
                name='activity1'
                rows={3}
                onChange={e => handleFieldChange(e, ix, aix)}
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

      <CreateButton onClick={handleAddNewJob} text='+' extraClasses='bg-indigo-400 fixed top-16 right-8 lg:bottom-8 lg:right-4 text-md' />
    </div>
  )
}
