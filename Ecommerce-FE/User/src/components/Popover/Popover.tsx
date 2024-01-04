import { ReactNode, useRef, useState } from 'react'
import { useFloating, arrow, shift, flip, offset } from '@floating-ui/react-dom'
import { FloatingPortal } from '@floating-ui/react'
import useIdHook from 'src/hooks/useIdHook'
import { NavLink, To } from 'react-router-dom'

type PopoverProps = {
  classNameBlock: string
  classNameArrow: string
  off?: number
  as: ReactNode
  children: ReactNode
  to?: To
}

function Popover({
  classNameBlock,
  classNameArrow,
  off,
  as,
  children,
  to
}: PopoverProps) {
  const arrowRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const idFloatingPortal = useIdHook()
  const { x, y, strategy, refs, middlewareData } = useFloating({
    middleware: [
      shift(),
      offset(off),
      flip(),
      arrow({
        element: arrowRef
      })
    ],
    placement: 'bottom-end'
  })
  const onMouseEnterHandle = () => {
    setIsOpen(true)
  }
  const onMouseLeaveHandle = () => {
    setIsOpen(false)
  }
  return (
    <div
      className={classNameBlock}
      ref={refs.setReference}
      onMouseEnter={onMouseEnterHandle}
      onMouseLeave={onMouseLeaveHandle}
      onClick={() => setIsOpen(!isOpen)}
    >
      {as}
      <FloatingPortal id={idFloatingPortal}>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content'
            }}
            className='relative'
          >
            {to ? (
              <NavLink
                to={`/${to}`}
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
                ref={arrowRef}
                className={classNameArrow}
              />
            ) : (
              <span
                style={{
                  left: middlewareData.arrow?.x,
                  top: middlewareData.arrow?.y
                }}
                ref={arrowRef}
                className={classNameArrow}
              />
            )}
            {children}
          </div>
        )}
      </FloatingPortal>
    </div>
  )
}

export default Popover
