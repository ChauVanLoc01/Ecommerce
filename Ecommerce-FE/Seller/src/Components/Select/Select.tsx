import { useEffect, useState } from 'react'

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
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { GoChevronDown, GoChevronUp } from 'react-icons/go'

import Icon from '../Icon'

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
    const [selected, setSelected] = useState<number | undefined>(
        defaultValue ? defaultValue : undefined
    )
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

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismis
    ])

    useEffect(() => {
        defaultValue && setChoosed && setChoosed(data[defaultValue])
    }, [])

    return (
        <>
            <button
                className={`border border-gray-200 flex justify-between items-center py-2 px-3 rounded-[5px] w-[190px] ${refClassName} hover:border-primary/50 focus:border-primary/50 text-[15px]`}
                ref={refs.setReference}
                {...getReferenceProps()}
            >
                <span className='line-clamp-1'>
                    {selected === undefined
                        ? defaultValue
                            ? data[defaultValue]
                            : title
                        : data[selected]}
                </span>
                {!isOpen ? (
                    <Icon icon={<GoChevronDown />} size='16px' />
                ) : (
                    <Icon icon={<GoChevronUp />} size='16px' />
                )}
            </button>
            <FloatingPortal>
                <motion.div
                    className={classNames(
                        'flex flex-col text-[15px] bg-white shadow-md overflow-hidden border border-gray-100 rounded-sm',
                        floatingClassNames
                    )}
                    ref={refs.setFloating}
                    {...getFloatingProps()}
                    style={floatingStyles}
                    initial={{ opacity: 0 }}
                    animate={isOpen ? 'active' : 'inactive'}
                    variants={{
                        active: {
                            opacity: 1,
                            height: 'auto',
                            transition: {
                                when: 'beforeChildren',
                                staggerChildren: data.length / 15 / data.length
                            }
                        },
                        inactive: {
                            opacity: 0,
                            height: 0,
                            transition: {
                                when: 'afterChildren',
                                staggerChildren: data.length / 15 / data.length,
                                staggerDirection: -1
                            }
                        }
                    }}
                    transition={{ duration: data.length / 10 }}
                >
                    {data.map((e, i) => (
                        <motion.button
                            key={i}
                            className={classNames(
                                'hover:bg-gray-100 text-left w-full py-2 px-3',
                                itemInFloatingClassname,
                                {
                                    'bg-primary/80 text-white': selected === i
                                }
                            )}
                            onClick={() => {
                                setSelected(i)
                                setChoosed && setChoosed(data[i])
                                setIsOpen(false)
                            }}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                height: 'auto'
                            }}
                            transition={{ duration: data.length / 15 / 15 }}
                        >
                            {e}
                        </motion.button>
                    ))}
                </motion.div>
            </FloatingPortal>
        </>
    )
}

export default Select
