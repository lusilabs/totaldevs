export const Label = ({htmlFor, title}) => {
    return <label htmlFor={htmlFor} className='block text-sm font-medium text-gray-700'>
        {title}
    </label>
}
