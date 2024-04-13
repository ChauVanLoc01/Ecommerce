type CheckboxProps = {
    text: string
    htmlFor: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Checkbox = ({ htmlFor, text, ...rest }: CheckboxProps) => {
    return (
        <div className='flex items-center space-x-2'>
            <input
                type='checkbox'
                className='shrink-0 border-gray-200 rounded text-blue-600 disabled:opacity-50 disabled:pointer-events-none tracking-wide size-3'
                id={htmlFor}
                {...rest}
            />
            <label htmlFor={htmlFor} className='text-[16px] tracking-wide line-clamp-1'>
                {text}
            </label>
        </div>
    )
}

export default Checkbox
