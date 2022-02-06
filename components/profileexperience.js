import { useStackOverflowSearch } from '@/utils/hooks'
import CreateButton from '@/components/createbutton'

function ProfileExperience ({ register, errors, jobs, setJobs }) {
  const DropdownComponent = useStackOverflowSearch(jobs, setJobs)

  // setSelectedStack(userDoc.stack ?? [])
  // setDropdownOptions(userDoc.stack?.map(name => ({ key: name, value: name, text: name })) ?? [])
  const handleRoleChange = (e, ix) => {
    const jobsClone = [...jobs]
    jobsClone[ix].role = e.target.value
    setJobs(jobsClone)
  }
  console.log({ jobs })
  const handleAddNewJob = () => setJobs(js => [...js, {}])
  return (
    <div>
      <h3 className='text-gray-500 m-4 p-4'>jobs</h3>

      {jobs.length === 0 && <div className='col-span-6 text-gray text-xl'>no jobs registered, please add a job</div>}
      {jobs.length > 0 && jobs.map((j, ix) =>

        <div key={ix} className='m-4 p-4 md:m-6 md:p-6 rounded-lg overflow-hidden shadow grid grid-cols-6 gap-6 pb-12'>
          <div className='col-span-6 sm:col-span-6'>
            <label htmlFor='stack' className='block text-sm font-medium text-gray-700'>
              tech stack used
            </label>
            <DropdownComponent />
          </div>

          <div className='col-span-6 sm:col-span-3'>
            <label htmlFor='role' className='block text-sm font-medium text-gray-700'>
              role
            </label>
            <input
              type='text'
              id='role'
              name='role'
              placeholder=''
              autoComplete='given-role'
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleRoleChange(e, 0)}
            />
          </div>

        </div>
      )}

      <div onClick={handleAddNewJob} className='fixed top-16 right-8 lg:bottom-8 lg:right-4 text-md'>
        <CreateButton text='+' extraClasses='bg-green-500' disabled />
      </div>
    </div>
  )
}

export default ProfileExperience
