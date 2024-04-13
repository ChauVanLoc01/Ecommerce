import { ElementType, useId, useRef, useState } from 'react'

import {
    useInteractions,
    useFloating,
    useHover,
    FloatingPortal,
    arrow,
    FloatingArrow,
    safePolygon,
    offset,
    shift
} from '@floating-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { type AnimationProps } from 'framer-motion'

type PopoverProps = {
    refChild: React.ReactNode | string
    floatingChild: React.ReactNode
    as?: ElementType
    refClassName?: string
    floatingClassName?: string
    hasArrow?: boolean
    arrowStrokeWidth?: number
    arrowStrokeColor?: string
    arrowClassName?: string
} & AnimationProps

function Popover({
    floatingChild,
    refChild,
    floatingClassName,
    refClassName,
    hasArrow,
    arrowClassName,
    arrowStrokeColor,
    arrowStrokeWidth,
    as: Element = 'button',
    animate,
    exit,
    initial,
    transition,
    variants
}: PopoverProps) {
    const id = useId()
    const [isOpen, setIsOpen] = useState(false)
    const arrowRef = useRef(null)

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            arrow({
                element: arrowRef
            }),
            offset(5),
            shift()
        ],
        transform: false
    })

    const hover = useHover(context, {
        delay: 200,
        handleClose: safePolygon()
    })

    const { getReferenceProps, getFloatingProps } = useInteractions([hover])
    return (
        <div>
            <Element
                className={refClassName}
                ref={refs.setReference}
                {...getReferenceProps()}
            >
                {refChild}
            </Element>
            <FloatingPortal id={id}>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className={floatingClassName}
                            ref={refs.setFloating}
                            style={floatingStyles}
                            {...getFloatingProps()}
                            animate={animate}
                            initial={initial}
                            exit={exit}
                            transition={transition}
                            variants={variants}
                        >
                            {hasArrow && (
                                <FloatingArrow
                                    stroke={arrowStrokeColor}
                                    strokeWidth={arrowStrokeWidth}
                                    className={arrowClassName}
                                    ref={arrowRef}
                                    context={context}
                                />
                            )}
                            {floatingChild}
                        </motion.div>
                    )}
                </AnimatePresence>
            </FloatingPortal>
        </div>
    )
}

export default Popover
