import { ReactNode, useState } from 'react'

import classNames from 'classnames'
import { motion } from 'framer-motion'
import { IoMdArrowDropdown } from 'react-icons/io'
import { LuDot } from 'react-icons/lu'
import { NavLink } from 'react-router-dom'
import Button from '../Button'

type SelectProps = {
    icon?: ReactNode
    parentData: {
        title: string
        path?: string
    }
    childrenData?: {
        title: string
        path: string
    }[]
}

const Select = ({ icon, parentData, childrenData }: SelectProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <section className='space-y-2'>
            <Button
                type='text'
                iconLeft={icon}
                text={parentData.title}
                iconRight={
                    childrenData && (
                        <IoMdArrowDropdown
                            size={22}
                            className={classNames('ease-in-out duration-300', {
                                '-rotate-180': isOpen
                            })}
                        />
                    )
                }
                onClick={() => setIsOpen((preState) => !preState)}
                rootClassNames={classNames('w-full justify-between pl-[20px] text-text_2', {
                    'bg-blue/[0.08] !text-blue hover:bg-blue/20': isOpen
                })}
            />
            {childrenData && (
                <motion.ul
                    initial={false}
                    animate={isOpen ? 'open' : 'close'}
                    variants={{
                        open: {
                            height: 'auto',
                            transition: {
                                when: 'beforeChildren',
                                staggerChildren: 0.025
                            }
                        },
                        close: {
                            height: 0,
                            transition: {
                                when: 'afterChildren',
                                staggerChildren: 0.025,
                                staggerDirection: -1
                            }
                        }
                    }}
                >
                    {Object.values(childrenData).map((children, idx) => (
                        <motion.li
                            key={idx}
                            variants={{
                                open: {
                                    x: 0,
                                    transition: {
                                        type: 'spring',
                                        stiffness: 100
                                    }
                                },
                                close: {
                                    x: -150
                                }
                            }}
                        >
                            <NavLink to={children.path}>
                                {({ isActive }) => (
                                    <Button
                                        iconLeft={<LuDot />}
                                        text={children.title}
                                        type='text'
                                        rootClassNames={classNames('text-text_2 pl-[20px]', {
                                            'text-blue': isActive
                                        })}
                                    />
                                )}
                            </NavLink>
                        </motion.li>
                    ))}
                </motion.ul>
            )}
        </section>
    )
}

export default Select
