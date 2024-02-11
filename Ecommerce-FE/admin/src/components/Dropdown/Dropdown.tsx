import { useEffect, useState } from 'react'

import { FloatingPortal } from '@floating-ui/react'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { MdOutlineArrowDropDown } from 'react-icons/md'
import SimpleBar from 'simplebar-react'

import { useFloating } from 'src/hooks/useFloating'

type DropdownProps = {
    refClassNames?: string
    floatingClassNames?: string
    data: { [key: string]: string }
}

const Dropdown = ({
    data,
    floatingClassNames,
    refClassNames
}: DropdownProps) => {
    const [width, setWidth] = useState<number>(0)

    const {
        floatingStyles,
        getFloatingProps,
        getReferenceProps,
        isOpen,
        refs,
        setIsOpen
    } = useFloating()

    const handleChoose = () => {
        setIsOpen(false)
    }

    useEffect(() => {
        if (refs.reference.current) {
            setWidth(refs.reference.current.getBoundingClientRect().width)
        }
    }, [refs.reference])

    return (
        <>
            <button
                className={classNames(
                    'px-16 py-8 rounded-8 border border-border flex items-center justify-between w-full focus-within:ring-[1px] focus-within:ring-blue',
                    refClassNames
                )}
                ref={refs.setReference}
                {...getReferenceProps()}
                onClick={() => setIsOpen((preState) => !preState)}
            >
                <span>Dropdown</span>
                <MdOutlineArrowDropDown
                    size={25}
                    className={classNames(
                        'transition-all duration-300 ease-in-out',
                        {
                            '-rotate-180': isOpen
                        }
                    )}
                />
            </button>
            <FloatingPortal>
                <motion.section
                    className={classNames(
                        'rounded-8 bg-white shadow-sm border-border/40 border overflow-hidden',
                        floatingClassNames
                    )}
                    initial={'close'}
                    animate={isOpen ? 'open' : 'close'}
                    variants={{
                        open: {
                            height: 'auto',
                            opacity: 1,
                            transition: {
                                when: 'beforeChildren',
                                staggerChildren: 0.025,
                                type: 'just'
                            }
                        },
                        close: {
                            height: 0,
                            opacity: 0,
                            transition: {
                                when: 'afterChildren',
                                staggerDirection: -1,
                                staggerChildren: 0.025,
                                type: 'just'
                            }
                        }
                    }}
                    ref={refs.setFloating}
                    {...getFloatingProps()}
                    style={{ ...floatingStyles, width }}
                >
                    <SimpleBar
                        style={{
                            maxHeight: '223px'
                        }}
                    >
                        {Object.values(data).map((value, index) => (
                            <motion.button
                                onClick={handleChoose}
                                key={index}
                                variants={{
                                    open: {
                                        height: 'auto',
                                        opacity: 1
                                    },
                                    close: {
                                        height: 0,
                                        opacity: 0
                                    }
                                }}
                                className='w-full hover:bg-blue/20 text-left px-16 py-8'
                            >
                                {value}
                            </motion.button>
                        ))}
                    </SimpleBar>
                </motion.section>
            </FloatingPortal>
        </>
    )
}

export default Dropdown
