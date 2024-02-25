import { useState } from 'react'

import classNames from 'classnames'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

type PasswordProps = {
    lable: string
    lableClassName?: string
    htmlFor: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Password = ({
    lable,
    lableClassName,
    htmlFor,
    className,
    ...rest
}: PasswordProps) => {
    const [visible, setVisible] = useState<boolean>(false)

    return (
        <section>
            <label
                htmlFor={htmlFor}
                className={classNames(
                    'block text-sm font-medium mb-2',
                    lableClassName,
                    {
                        hidden: !lable
                    }
                )}
            >
                {lable}
            </label>
            <div className='relative'>
                <input
                    type={visible ? 'text' : 'password'}
                    id={htmlFor}
                    className={classNames(
                        'py-2 pl-4 pr-9 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none',
                        className
                    )}
                    {...rest}
                />
                <button
                    className='absolute top-1/2 right-3 -translate-y-1/2'
                    onClick={() => setVisible(!visible)}
                >
                    {visible ? (
                        <AiOutlineEye className='text-gray-500' size={20} />
                    ) : (
                        <AiOutlineEyeInvisible
                            className='text-gray-500'
                            size={20}
                        />
                    )}
                </button>
            </div>
        </section>
    )
}

export default Password
