import { ReactNode } from 'react'

import classNames from 'classnames'
import { cn } from 'src/utils/utils'

type ButtonDrop = {
    text: string
    btn?: 'submit' | 'button'
    type?: 'default' | 'outline' | 'text' | 'dashed'
    iconLeft?: ReactNode
    iconRight?: ReactNode
    rootClassNames?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

const Button = ({
    text,
    type = 'default',
    btn = 'button',
    iconLeft,
    iconRight,
    rootClassNames,
    ...rest
}: ButtonDrop) => {
    return (
        <button
            className={classNames(
                'px-16 py-8 rounded-8 transition-all ease-in-out duration-200 flex items-center border-none',
                {
                    'space-x-5': iconRight,
                    'bg-blue text-white hover:bg-blue_hover': type === 'default',
                    'border border-blue hover:bg-blue/20 text-blue': type === 'outline',
                    'border border-dashed border-blue hover:bg-blue text-blue': type === 'dashed',
                    'text-blue': type === 'text'
                },
                rootClassNames
            )}
            type={btn}
            {...rest}
        >
            <section
                className={classNames('flex items-center', {
                    'space-x-3': iconLeft
                })}
            >
                <span>{iconLeft}</span>
                <span>{text}</span>
            </section>
            <span>{iconRight}</span>
        </button>
    )
}

export default Button
