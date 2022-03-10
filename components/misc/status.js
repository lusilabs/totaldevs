
const Status = ({ green = [], yellow = [], red = [], value }) => {
  if (green.includes(value)) {
    return (<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'> {value} </span>)
  }
  if (yellow.includes(value)) {
    return (<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> {value} </span>)
  }
  if (red.includes(value)) {
    return (<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'> {value} </span>)
  }
  return (<span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'> {value} </span>)
}

export default Status
