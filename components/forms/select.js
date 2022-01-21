export const Select = ({options, value, onChange}) => {
    return (<div>
        <div class="mb-3 xl:w-96">
            <select class="form-select appearance-none
                block
                w-full
                px-3
                py-1.5
                text-base
                font-normal
                text-gray-700
                bg-white bg-clip-padding bg-no-repeat
                border border-solid border-gray-300
                rounded
                transition
                ease-in-out
                m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" value={value} onChange={onChange}>
                    {
                        options?.map((option) => 
                            <option key={option.value || option} value= {option.value || option}>{option.text || option}</option>)
                    }
            </select>
        </div>
        </div>
    )
}