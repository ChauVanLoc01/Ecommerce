import { ReactNode } from 'react'

import classNames from 'classnames'

type InputProps = {
    iconLeft?: ReactNode
    iconRight?: ReactNode
    rootClassName?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Input = ({
    iconLeft,
    iconRight,
    type = 'text',
    rootClassName,
    className,
    ...inputProps
}: InputProps) => {
    return (
        <section className='hover:bg-gradient-to-bl hover:from-green-600 hover:via-blue hover:to-rose-700 hover:shadow-input focus-within:bg-gradient-to-bl focus-within:from-green-600 focus-within:via-blue focus-within:to-rose-700 focus-within:shadow-input p-[1px] bg-border rounded-8'>
            <section
                className={classNames(
                    'flex items-center px-16 py-8 rounded-8 bg-white',
                    {
                        'gap-x-2': iconLeft || iconRight
                    },
                    rootClassName
                )}
            >
                <span
                    className={classNames({
                        hidden: !iconLeft
                    })}
                >
                    {iconLeft}
                </span>
                <input
                    type={type}
                    className={classNames('grow', className)}
                    {...inputProps}
                />
                <span
                    className={classNames({
                        hidden: !iconRight
                    })}
                >
                    {iconRight}
                </span>
            </section>
        </section>
    )
}

export default Input
