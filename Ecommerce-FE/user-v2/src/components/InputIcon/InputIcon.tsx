import { ReactNode } from 'react'

import classNames from 'classnames'
import { UseFormRegisterReturn } from 'react-hook-form'

type InputProps = {
    icon?: ReactNode
    direct?: 'left' | 'right'
    rootClassName?: string
    register?: UseFormRegisterReturn<any>
} & React.InputHTMLAttributes<HTMLInputElement>

const InputIcon = ({
    icon,
    direct = 'left',
    type = 'text',
    rootClassName,
    className,
    register,
    ...rest
}: InputProps) => {
    return (
        <section className={classNames('relative', rootClassName)}>
            <span
                className={classNames('absolute top-1/2 -translate-y-1/2', {
                    'left-3': direct === 'left',
                    'right-3': direct === 'right'
                })}
            >
                {icon}
            </span>
            <input
                type={type}
                className={classNames(
                    'py-2 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none tracking-wide',
                    {
                        'pl-9 pr-4': direct === 'left',
                        'pr-9 pl-4': direct === 'right'
                    },
                    className
                )}
                {...register}
                {...rest}
            />
        </section>
    )
}

export default InputIcon
