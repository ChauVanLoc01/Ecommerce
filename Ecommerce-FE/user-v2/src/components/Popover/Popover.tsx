import { ReactNode } from 'react'

import { FloatingPortal } from '@floating-ui/react'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'

import { useFloating } from 'src/hooks/useFloating'

type PopoverProps = {
    referenceChildren: ReactNode | string
    referenceClassName?: string
    floatingChildren: ({
        setIsOpen
    }: {
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    }) => JSX.Element
    floatingClassName?: string
}

const Popover = ({
    floatingChildren,
    referenceChildren,
    referenceClassName,
    floatingClassName
}: PopoverProps) => {
    const {
        floatingStyles,
        getFloatingProps,
        getReferenceProps,
        isOpen,
        refs,
        setIsOpen
    } = useFloating(['bottom-end'], false)
    return (
        <>
            <button
                className={classNames(referenceClassName)}
                ref={refs.setReference}
                {...getReferenceProps()}
                onClick={() => setIsOpen(!isOpen)}
            >
                {referenceChildren}
            </button>
            <FloatingPortal>
                <AnimatePresence>
                    {isOpen && (
                        <motion.section
                            className={classNames(floatingClassName)}
                            initial={'close'}
                            animate={'open'}
                            exit={'close'}
                            variants={{
                                open: {
                                    transformOrigin: 'top right',
                                    scale: 1
                                },
                                close: {
                                    transformOrigin: 'top right',
                                    scale: 0
                                }
                            }}
                            transition={{
                                ease: 'easeInOut',
                                duration: 0.3
                            }}
                            ref={refs.setFloating}
                            {...getFloatingProps()}
                            style={{
                                ...floatingStyles
                            }}
                        >
                            {floatingChildren({ setIsOpen })}
                        </motion.section>
                    )}
                </AnimatePresence>
            </FloatingPortal>
        </>
    )
}

export default Popover
