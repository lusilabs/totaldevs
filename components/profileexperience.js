function ProfileExperience () {
  return (
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

  )
}

export default ProfileExperience
