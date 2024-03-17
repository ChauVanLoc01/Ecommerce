import { ReactNode } from 'react'

import classNames from 'classnames'
import { motion } from 'framer-motion'

type ButtonProps = {
    text: string | ReactNode
    isLoading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ text, type = 'button', className, onClick, onSubmit, isLoading }: ButtonProps) => {
    return (
        <motion.button
            whileHover={{
                scale: 1.01,
                transition: {
                    ease: 'easeInOut'
                }
            }}
            whileTap={{
                scale: 0.95
            }}
            type={type}
            className={classNames(
                'py-2 px-4 inline-flex justify-center items-center gap-x-2 text-xs font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none tracking-wide',
                className
            )}
            onClick={onClick}
            onSubmit={onSubmit}
        >
            <span
                className={classNames({
                    hidden: !isLoading
                })}
            >
                <svg
                    className='animate-spin mr-1 h-4 w-4 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                >
                    <circle className='opacity-25' cx={12} cy={12} r={10} stroke='currentColor' strokeWidth={4} />
                    <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                </svg>
            </span>
            {text}
        </motion.button>
    )
}

export default Button
