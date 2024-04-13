import React, { useState } from 'react'

import classNames from 'classnames'
import { UseFormRegisterReturn } from 'react-hook-form'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

type PasswordProps = {
    lable: string
    lableClassName?: string
    htmlFor: string
    register?: UseFormRegisterReturn<any>
    error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Password = ({ lable, lableClassName, htmlFor, className, error, register, ...rest }: PasswordProps) => {
    const [visible, setVisible] = useState<boolean>(false)

    return (
        <section>
            <div className='flex justify-between items-center'>
                <label
                    htmlFor={htmlFor}
                    className={classNames('inline-block text-sm font-medium mb-2', lableClassName, {
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
            <div className='relative'>
                <input
                    type={visible ? 'text' : 'password'}
                    id={htmlFor}
                    className={classNames(
                        'py-2 pl-4 pr-9 block w-full border border-gray-200 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none',
                        className,
                        {
                            'focus-within:ring-red-500 focus:border-red-500': error,
                            'focus:border-blue-500 focus:ring-blue-500': !error
                        }
                    )}
                    {...register}
                    {...rest}
                />
                <button
                    type='button'
                    className='absolute top-1/2 right-3 -translate-y-1/2'
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? (
                        <AiOutlineEye className='text-gray-500' size={20} />
                    ) : (
                        <AiOutlineEyeInvisible className='text-gray-500' size={20} />
                    )}
                </button>
            </div>
        </section>
    )
}

export default Password
