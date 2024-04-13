import { useState } from 'react'

import {
    Placement,
    autoPlacement,
    autoUpdate,
    flip,
    offset,
    size,
    useClick,
    useDismiss,
    useFloating as useFloatingLib,
    useInteractions
} from '@floating-ui/react'

export const useFloating = (
    placement: Placement[],
    isFloatingWidthFull = true,
    spacing = 5
) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const { refs, floatingStyles, context, middlewareData } = useFloatingLib({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset(spacing),
            flip(),
            autoPlacement({
                allowedPlacements: placement
            }),
            size(
                isFloatingWidthFull
                    ? {
                          apply({ rects, elements }) {
                              Object.assign(elements.floating.style, {
                                  width: `${rects.reference.width}px`
                              })
                          }
                      }
                    : undefined
            )
        ],
        whileElementsMounted: autoUpdate,
        transform: false
    })

    const click = useClick(context)

    const dismiss = useDismiss(context)

    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss
    ])
    return {
        refs,
        floatingStyles,
        getReferenceProps,
        getFloatingProps,
        isOpen,
        setIsOpen,
        middlewareData
    }
}
