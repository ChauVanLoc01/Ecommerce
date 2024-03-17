import { useState } from 'react'

import { FloatingPortal } from '@floating-ui/react'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { MdOutlineArrowDropDown } from 'react-icons/md'
import SimpleBar from 'simplebar-react'

import { useFloating } from 'src/hooks/useFloating'
import useQueryParams from 'src/hooks/useQueryParams'
import { ProductListQuery } from 'src/types/product.type'

type DropdownProps = {
    rootClassNames?: string
    refClassNames?: string
    floatingClassNames?: string
    title?: string
    active?: string
    data: { [key: string]: string }
}

const Dropdown = ({ data, rootClassNames, floatingClassNames, refClassNames, active, title }: DropdownProps) => {
    const [queryParams, setQueryParams] = useQueryParams<Partial<Record<keyof ProductListQuery, string>>>()

    const [choosed, setChoosed] = useState<string | undefined>(active ? data[active] : undefined)

    const { floatingStyles, getFloatingProps, getReferenceProps, isOpen, refs, setIsOpen } = useFloating([
        'bottom-start'
    ])

    const handleChoose = (key: string) => () => {
        setChoosed(data[key])
        setIsOpen(false)
        const filter = key.split('_')
        const excludeFilter = Object.entries(queryParams).filter(([_, value]) => !['asc', 'desc'].includes(value))
        setQueryParams({
            ...Object.fromEntries(excludeFilter),
            [filter[0]]: filter[1]
        })
    }

    return (
        <>
            <section
                className={classNames(
                    'focus-within:border focus-within:border-blue-500 focus-within:ring-blue-500 focus-within:ring-1 p-[1px] bg-border/30 rounded-8',
                    rootClassNames
                )}
            >
                <button
                    className={classNames(
                        'px-16 py-8 rounded-8 flex items-center justify-between w-full bg-white h-full tracking-wide',
                        refClassNames
                    )}
                    ref={refs.setReference}
                    {...getReferenceProps()}
                    onClick={() => setIsOpen((preState) => !preState)}
                >
                    <span>{choosed ?? title}</span>
                    <MdOutlineArrowDropDown
                        size={25}
                        className={classNames('transition-all duration-300 ease-in-out', {
                            '-rotate-180': isOpen
                        })}
                    />
                </button>
            </section>
            <FloatingPortal>
                <motion.ul
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
                                staggerChildren: 0.015,
                                type: 'just'
                            }
                        },
                        close: {
                            height: 0,
                            opacity: 0,
                            transition: {
                                when: 'afterChildren',
                                staggerDirection: -1,
                                staggerChildren: 0.015,
                                type: 'just'
                            }
                        }
                    }}
                    ref={refs.setFloating}
                    {...getFloatingProps()}
                    style={{ ...floatingStyles }}
                >
                    <SimpleBar style={{ maxHeight: 218 }}>
                        {Object.keys(data).map((key, index) => (
                            <motion.li
                                onClick={handleChoose(key)}
                                key={index}
                                variants={{
                                    open: {
                                        opacity: 1
                                    },
                                    close: {
                                        opacity: 0
                                    }
                                }}
                                className='w-full hover:bg-blue/20 text-left px-16 py-2 cursor-pointer hover:bg-blue-600 hover:text-white tracking-wide'
                            >
                                {data[key]}
                            </motion.li>
                        ))}
                    </SimpleBar>
                </motion.ul>
            </FloatingPortal>
        </>
    )
}

export default Dropdown
