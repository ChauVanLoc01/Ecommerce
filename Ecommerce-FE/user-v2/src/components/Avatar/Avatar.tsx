import { AvatarProps, Avatar as AvatarRadix } from '@radix-ui/themes'
import React from 'react'

type Props = AvatarProps & {
    src: string
    fallback: string
}

const Avatar = ({ fallback, src, ...rest }: Props) => {
    return <AvatarRadix {...rest} src={src} fallback={fallback} size={'4'} />
}

export default React.memo(Avatar)
