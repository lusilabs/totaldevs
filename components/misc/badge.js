const TopCornerBadge = ({ count }) => {
  if (!count) {
    return null
  }
  return (
    <span className='absolute z-40 top-0 right-0 inline-flex px-2 py-1 text-md font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full'>
      {count}
    </span>
  )
}

export default TopCornerBadge
