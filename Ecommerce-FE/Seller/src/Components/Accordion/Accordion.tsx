import { useState } from 'react'

import classNames from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'
import { GoChevronDown } from 'react-icons/go'

import Icon from '../Icon'

type AccordionProps = {
    icon?: React.ReactNode
    title: string
    rootClassName?: string
    content: React.ReactNode
    isActive: boolean
    childrenLength: number
}

function Accordion({
    content,
    title,
    icon,
    rootClassName,
    isActive,
    childrenLength
}: AccordionProps) {
    const [isOpen, setIsOpen] = useState(isActive)
    return (
        <div className={`${rootClassName} text-[16px] px-2 space-y-2`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={classNames(
                    'flex items-center justify-between group cursor-pointer text-gray-400 font-medium w-full',
                    {
                        'text-primary': isActive
                    }
                )}
            >
                <div className='flex gap-x-2 items-center relative pl-6 group-hover:text-primary'>
                    <Icon
                        icon={icon}
                        className='absolute top-1/2 left-0 -translate-y-1/2'
                        size='18px'
                    />
                    <span>{title}</span>
                </div>
                <Icon
                    icon={<GoChevronDown />}
                    size='18px'
                    className='group-hover:text-primary'
                />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        animate={{
                            opacity: 1,
                            height: 'auto',
                            overflow: 'hidden'
                        }}
                        exit={{
                            opacity: 0,
                            height: 0,
                            overflow: 'hidden'
                        }}
                        transition={{
                            duration: childrenLength / 17,
                            ease: [0.2, 0.2, 0.2, 0.3]
                        }}
                        className='text-[15px] pl-6 space-y-2 flex flex-col items-start'
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Accordion
