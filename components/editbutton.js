function EditButton ({ setIsEditing }) {
  return (
    <button
      className='text-gray-500 px-4 w-auto h-6 bg-gray-400 rounded-full hover:bg-gray-700 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none'
      onClick={setIsEditing}
    >
      <svg viewBox='0 0 20 20' enableBackground='new 0 0 20 20' className='w-3 h-3 inline-block mr-2'>
        <path
          fill='#FFFFFF' d='M17.561,2.439c-1.442-1.443-2.525-1.227-2.525-1.227L8.984,7.264L2.21,14.037L1.2,18.799l4.763-1.01
                                    l6.774-6.771l6.052-6.052C18.788,4.966,19.005,3.883,17.561,2.439z M5.68,17.217l-1.624,0.35c-0.156-0.293-0.345-0.586-0.69-0.932
                                    c-0.346-0.346-0.639-0.533-0.932-0.691l0.35-1.623l0.47-0.469c0,0,0.883,0.018,1.881,1.016c0.997,0.996,1.016,1.881,1.016,1.881
                                    L5.68,17.217z'
        />
      </svg>
      <span className='text-white text-sm'>edit</span>
    </button>
  )
}

export default EditButton
