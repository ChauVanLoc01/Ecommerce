import { GoChevronDown } from 'react-icons/go'
import Icon from '../Icon'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

type AccordionProps = {
  icon?: React.ReactNode
  title: string
  rootClassName?: string
  content: React.ReactNode
  duration?: number
}

function Accordion({ content, title, icon, rootClassName, duration = 0.2 }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className={`${rootClassName} text-xs px-2`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center justify-between group cursor-pointer text-gray-400 font-semibold w-full'
      >
        <div className='flex gap-x-2 items-center relative pl-5 pr-2 group-hover:text-primary'>
          <Icon icon={icon} className='absolute top-1/2 left-0 -translate-y-1/2' size='16px' />
          <span>{title}</span>
        </div>
        <Icon icon={<GoChevronDown />} size='18px' className='group-hover:text-primary' />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
            exit={{
              opacity: 0,
              height: 0,
              overflow: 'hidden'
            }}
            transition={{ duration, ease: [0.2, 0.2, 0.2, 0.3] }}
            className='text-gray-600 text-xs pl-5 pr-2 py-1 space-y-1 flex flex-col items-start'
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Accordion
