import { useState } from 'react'

import {
    useClick,
    useInteractions,
    useFloating as useFloatingLib,
    offset,
    flip,
    useDismiss
} from '@floating-ui/react'

export const useFloating = (spacing = 5) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const { refs, floatingStyles, context } = useFloatingLib({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: 'bottom-start',
        middleware: [offset(spacing), flip()]
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
        setIsOpen
    }
}
