type CheckboxProps = {
    text: string
    htmlFor: string
}

const Checkbox = ({ htmlFor, text }: CheckboxProps) => {
    return (
        <div className='flex items-center space-x-2'>
            <input
                type='checkbox'
                className='shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none tracking-wider'
                id={htmlFor}
            />
            <label htmlFor={htmlFor} className='text-sm tracking-wider'>
                {text}
            </label>
        </div>
    )
}

export default Checkbox
