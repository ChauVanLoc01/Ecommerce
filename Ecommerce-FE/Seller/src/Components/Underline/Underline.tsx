import { useEffect, useRef, useState } from 'react'

import { NavLink, To, useLocation } from 'react-router-dom'

import { hash } from 'src/utils/utils'

type UnderlineProps = {
    rootClassName?: string
    itemClassName?: string
    contents: { title: string; to: To }[]
}

const joinTo = (to: To) => {
    if (typeof to === 'object') {
        return hash(
            `${to.pathname?.replace('/', '')}/${to.search?.replace('?', '')}`
        )
    }
    return hash(to)
}

function Underline({ contents, itemClassName, rootClassName }: UnderlineProps) {
    const location = useLocation()
    const rootRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState<{
        width: number
        left: number
    }>({
        width: 0,
        left: 0
    })

    useEffect(() => {
        if (rootRef && rootRef.current) {
            const children = rootRef.current.querySelector(
                `#${joinTo(location.search ? location : location.pathname)}`
            ) as HTMLAnchorElement
            children &&
                setPosition({
                    width: children.clientWidth,
                    left: children.offsetLeft
                })
        }
    }, [location])

    return (
        <div className={`${rootClassName} relative`} ref={rootRef}>
            {contents.map(({ title, to }, i) => (
                <NavLink
                    to={to}
                    id={
                        typeof to === 'object'
                            ? (joinTo({
                                  ...(to as object),
                                  pathname: location.pathname
                              }) as string)
                            : (joinTo(location.pathname) as string)
                    }
                    key={i}
                    className={`${itemClassName} inline-block`}
                >
                    {title}
                </NavLink>
            ))}
            <span
                className={`h-0.5 rounded-full duration-300 bg-primary absolute bottom-0`}
                style={{
                    left: position.left,
                    width: position.width
                }}
            />
        </div>
    )
}

export default Underline
