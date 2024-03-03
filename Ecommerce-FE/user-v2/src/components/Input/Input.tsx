import classNames from 'classnames'

type InputProps = {
    rootClassName?: string
    lable?: string
    lableClassName?: string
    htmlFor?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Input = ({
    rootClassName,
    lable,
    lableClassName,
    htmlFor,
    type = 'text',
    className,
    ...rest
}: InputProps) => {
    return (
        <section className={rootClassName}>
            <label
                htmlFor={htmlFor}
                className={classNames(
                    'block text-sm font-medium mb-2 tracking-wide',
                    lableClassName,
                    {
                        hidden: !lable
                    }
                )}
            >
                {lable}
            </label>
            <input
                type={type}
                id={htmlFor}
                className={classNames(
                    'py-2 px-4 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
                    className
                )}
                {...rest}
            />
        </section>
    )
}

export default Input
