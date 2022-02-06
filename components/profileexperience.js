function ProfileExperience ({ register, errors }) {
  return (

    <div className='shadow overflow-hidden rounded-lg p-4 sm:p-6 grid grid-cols-6 gap-6'>

      <div className='col-span-6 sm:col-span-6'>
        <label htmlFor='stack' className='block text-sm font-medium text-gray-700'>
        tech stack
      </label>
        <Dropdown
        onChange={handleChange}
        onSearchChange={handleSearchChange}
        options={dropdownOptions}
        searchQuery={searchQuery}
        value={selectedStack}
        fluid
        multiple
        selection
        search
      />
      </div>
    </div>

  )
}

export default ProfileExperience
