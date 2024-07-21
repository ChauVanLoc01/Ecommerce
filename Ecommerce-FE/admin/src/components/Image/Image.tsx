import React from 'react'
import { cn } from 'src/utils/utils'

type Props = {
    src: string
    fallback: string
    className?: string
}

const Image = ({ src, fallback, className }: Props) => {
    return <img className={cn('size-14 rounded-8', className)} src={src} alt={fallback} loading='lazy' />
}

export default React.memo(Image)
