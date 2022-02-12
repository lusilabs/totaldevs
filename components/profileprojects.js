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

export default function ProfileProjects ({ projects, setProjects }) {
  const [dropdownOptions, setDropdownOptions] = useState(projects.map(p => p.stack?.map(name => ({ key: name, value: name, text: name })) ?? []))
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
    const projectsClone = [...projects]
    projectsClone[ix][e.target.id] = e.target.value
    setProjects(projectsClone)
  }
  const handleAddNewProject = () => {
    setProjects(js => [...js, { stack: [] }])
    setDropdownOptions(p => [...p, []])
  }
  const handleRemoveProject = (e, ix) => {
    e.preventDefault()
    const projectsClone = [...projects]
    projectsClone.splice(ix, 1)
    setProjects(projectsClone)
  }

  const handleSearchChange = async (e, { searchQuery: query }, ix) => setSearchQuery([query, ix])
  const handleChange = (e, { value }, ix) => {
    const projectsClone = [...projects]
    projectsClone[ix].stack = value
    setProjects(projectsClone)
  }

  return (
    <div>
      <h3 className='text-gray-500 m-4 p-4'>projects</h3>

      {projects.length === 0 && <div className='text-red-400 text-lg shadow m-4 p-4 text-center'>no projects registered, please add a project</div>}
      {projects.length > 0 && projects.map((p, ix) =>

        <div key={ix} className='relative m-4 p-4 md:m-6 md:p-6 rounded-lg overflow-hidden shadow grid grid-cols-6 gap-6 pb-12'>
          <div className='col-span-6'>
            <div className='text-sm font-medium text-gray-500'>#{ix + 1}</div>
          </div>

          <div className='col-span-6 sm:col-span-2'>
            <label htmlFor='role' className='block text-sm font-medium text-gray-700'>
              role
            </label>
            <input
              type='text'
              id='role'
              name='role'
              placeholder='Creator / Contributor'
              autoComplete='given-role'
              defaultValue={p.role}
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <div className='col-span-6 sm:col-span-2'>
            <label htmlFor='projectName' className='block text-sm font-medium text-gray-700'>
              project name
            </label>
            <input
              type='text'
              id='projectName'
              name='projectName'
              placeholder=''
              autoComplete='given-projectName'
              defaultValue={p.projectName}
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <div className='col-span-6 sm:col-span-2'>
            <label htmlFor='projectURL' className='block text-sm font-medium text-gray-700'>
              (project url)
            </label>
            <input
              type='text'
              id='projectURL'
              name='projectURL'
              placeholder=''
              autoComplete='given-projectURL'
              defaultValue={p.projectURL}
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <div className='col-span-6 sm:col-span-6'>
            <label htmlFor='stack' className='block text-sm font-medium text-gray-700'>
              tech stack used
            </label>
            <Dropdown
              options={dropdownOptions[ix] ?? []}
              onChange={(e, v) => handleChange(e, v, ix)}
              onSearchChange={(e, v) => handleSearchChange(e, v, ix)}
              searchQuery={searchQuery[0]}
              value={p.stack}
              fluid
              multiple
              selection
              search
            />
          </div>

          <div className='col-span-6'>
            <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
              description
            </label>
            <div className='mt-1'>
              <textarea
                id='description'
                name='description'
                required
                rows={3}
                defaultValue={p.description}
                onChange={e => handleFieldChange(e, ix)}
                className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md'
              />
            </div>
          </div>
          <button
            onClick={e => handleRemoveProject(e, ix)}
            className='bg-red-200 h-6 px-4 absolute bottom-2 left-2 rounded-full'
          >remove
          </button>

        </div>
      )}

      <CreateButton onClick={handleAddNewProject} text='+' extraClasses='bg-indigo-400 fixed top-16 right-8 lg:bottom-8 lg:right-4 text-md' />
    </div>
  )
}
