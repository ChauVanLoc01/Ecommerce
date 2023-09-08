import {
  FloatingPortal,
  flip,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions
} from '@floating-ui/react'
import { useEffect, useState } from 'react'
import Icon from '../Icon'
import { GoChevronDown, GoChevronUp } from 'react-icons/go'
import classNames from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'

type SelectProps = {
  refClassName?: string
  floatingClassNames?: string
  itemInFloatingClassname?: string
  title: string | React.ReactNode
  data: string[]
  defaultValue?: number
  setChoosed?: React.Dispatch<React.SetStateAction<string | undefined>>
}

function Select({
  data,
  title,
  refClassName,
  floatingClassNames,
  itemInFloatingClassname,
  setChoosed,
  defaultValue
}: SelectProps) {
  const [selected, setSelected] = useState<number | undefined>(defaultValue ? defaultValue : undefined)
  const [isOpen, setIsOpen] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(3),
      shift(),
      flip(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`
          })
        }
      })
    ],
    placement: 'bottom-start'
  })

  const click = useClick(context)
  const dismis = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismis])

  useEffect(() => {
    defaultValue && setChoosed && setChoosed(data[defaultValue])
  }, [])

  return (
    <div
      className={classNames('max-w-full', {
        'shadow-sm': isOpen
      })}
    >
      <div
        className={`cursor-pointer border border-gray-200 flex justify-between items-center ${refClassName} hover:border-gray-400`}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <span className='line-clamp-1'>
          {selected === undefined ? (defaultValue ? data[defaultValue] : title) : data[selected]}
        </span>
        {!isOpen ? <Icon icon={<GoChevronDown />} size='16px' /> : <Icon icon={<GoChevronUp />} size='16px' />}
      </div>
      {isOpen && (
        <FloatingPortal>
          <AnimatePresence>
            <motion.div
              className={`flex flex-col items-start text-xs bg-white shadow-md overflow-hidden border border-gray-100 ${floatingClassNames}`}
              ref={refs.setFloating}
              {...getFloatingProps()}
              style={floatingStyles}
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
              exit={{
                opacity: 0,
                height: 0,
                overflow: 'hidden'
              }}
              transition={{ duration: 0.2 }}
            >
              {data.map((e, i) => (
                <span
                  className={classNames(`cursor-default hover:bg-gray-100 w-full truncate ${itemInFloatingClassname}`, {
                    'bg-gray-100': selected === i
                  })}
                  onClick={() => {
                    setSelected(i)
                    setChoosed && setChoosed(data[i])
                    setIsOpen(false)
                  }}
                >
                  {e}
                </span>
              ))}
            </motion.div>
          </AnimatePresence>
        </FloatingPortal>
      )}
    </div>
  )
}

export default Select
