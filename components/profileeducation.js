import CreateButton from '@/components/createbutton'

export default function ProfileEducation ({ degrees, setDegrees }) {
  const handleFieldChange = (e, ix) => {
    const projectsClone = [...degrees]
    projectsClone[ix][e.target.id] = e.target.value
    setDegrees(projectsClone)
  }
  const handleAddNewDegree = () => setDegrees(js => [...js, { stack: [] }])
  const handleRemoveDegree = (e, ix) => {
    e.preventDefault()
    const projectsClone = [...degrees]
    projectsClone.splice(ix, 1)
    setDegrees(projectsClone)
  }

  return (
    <div>
      <div className='flex justify-between p-2'>
        <h3 className='text-gray-500 m-4 p-4'>degrees</h3>
        <CreateButton onClick={handleAddNewDegree} text='+' extraClasses='bg-indigo-400 text-md' />
      </div>
      {degrees.length === 0 && <>
        <div className='text-red-400 text-lg shadow m-4 p-4 text-center flex flex-col'>
          no degrees registered
          {/* <div>
            <input
              type='checkbox' id='noDegree' name='noDegree'
              className='ml-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
              checked={!!noDegree}
              onChange={e => { console.log({ e, noDegree }); setNoDegree(d => !d) }}
            />
            <label htmlFor='degreeName' className='ml-4 text-sm font-medium text-gray-700'>
              I have no degree
            </label>

          </div> */}
        </div>
                               </>}
      {degrees.length > 0 && degrees.map((d, ix) =>

        <div key={ix} className='relative m-4 p-4 md:m-6 md:p-6 rounded-lg overflow-hidden shadow grid grid-cols-6 gap-6 pb-12'>

          <div className='col-span-6'>
            <div className='text-sm font-medium text-gray-500'>#{ix + 1}</div>
          </div>

          <div className='col-span-6 sm:col-span-2'>
            <label htmlFor='degreeName' className='block text-sm font-medium text-gray-700'>
              degree and field of study
            </label>
            <input
              type='text'
              id='degreeName'
              name='degreeName'
              placeholder='BSc. Computer Science'
              autoComplete='given-degreeName'
              defaultValue={d.degreeName}
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <div className='col-span-6 sm:col-span-2'>
            <label htmlFor='universityName' className='block text-sm font-medium text-gray-700'>
              university name
            </label>
            <input
              type='text'
              id='universityName'
              name='universityName'
              placeholder=''
              autoComplete='given-universityName'
              defaultValue={d.universityName}
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <div className='col-span-3 sm:col-span-2'>
            <label htmlFor='universityURL' className='block text-sm font-medium text-gray-700'>
              (university url)
            </label>
            <input
              type='text'
              id='universityURL'
              name='universityURL'
              placeholder=''
              autoComplete='given-universityURL'
              defaultValue={d.universityURL}
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <div className='col-span-3 sm:col-span-2'>
            <label htmlFor='endYear' className='block text-sm font-medium text-gray-700'>
              end year
            </label>
            <input
              type='text'
              id='endYear'
              name='endYear'
              placeholder=''
              autoComplete='given-endYear'
              defaultValue={d.endYear}
              required
              className='mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
              onChange={e => handleFieldChange(e, ix)}
            />
          </div>

          <button
            onClick={e => handleRemoveDegree(e, ix)}
            className='bg-red-200 h-6 px-4 absolute bottom-2 left-2 rounded-full'
          >remove
          </button>

        </div>
      )}

    </div>
  )
}
