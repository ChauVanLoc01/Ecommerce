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
        <section
            className={classNames(
                'flex items-center rounded-8 border border-border px-16 py-8 focus-within:ring-[1px] focus-within:ring-blue focus-within:ring-inset',
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
    )
}

export default Input
