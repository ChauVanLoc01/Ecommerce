import classNames from 'classnames'
import React from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

type InputProps = {
    rootClassName?: string
    lable?: string
    lableClassName?: string
    htmlFor?: string
    register?: UseFormRegisterReturn<any>
    error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Input = ({
    rootClassName,
    lable,
    lableClassName,
    htmlFor,
    type = 'text',
    className,
    register,
    error,
    ...rest
}: InputProps) => {
    return (
        <section className={rootClassName}>
            <div className='flex justify-between items-center'>
                <label
                    htmlFor={htmlFor}
                    className={classNames('text-sm font-medium mb-2 tracking-wide', lableClassName, {
                        hidden: !lable
                    })}
                >
                    {lable}
                </label>
                <span
                    className={classNames('inline-block text-red-500', {
                        hidden: !error
                    })}
                >
                    {error}
                </span>
            </div>
            <input
                type={type}
                id={htmlFor}
                className={classNames(
                    'py-2 px-4 block w-full border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none',
                    className,
                    {
                        'focus-within:ring-red-500 focus:border-red-500': error,
                        'focus:border-blue-500 focus:ring-blue-500': !error
                    }
                )}
                autoComplete='off'
                {...register}
                {...rest}
            />
        </section>
    )
}

export default Input
