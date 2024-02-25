import { ReactNode } from 'react'

import classNames from 'classnames'
import { motion } from 'framer-motion'

type ButtonProps = {
    text: string | ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({
    text,
    type = 'button',
    className,
    onClick,
    onSubmit
}: ButtonProps) => {
    return (
        <motion.button
            whileHover={{
                scale: 1.01,
                transition: {
                    ease: 'easeInOut'
                }
            }}
            whileTap={{
                scale: 0.98
            }}
            type={type}
            className={classNames(
                'py-2 px-4 inline-flex justify-center items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none tracking-wide',
                className
            )}
            onClick={onClick}
            onSubmit={onSubmit}
        >
            {text}
        </motion.button>
    )
}

export default Button
