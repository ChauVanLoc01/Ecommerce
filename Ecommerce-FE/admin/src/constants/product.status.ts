import { BadgeProps } from '@radix-ui/themes'

export const ProductStatus: { [key: string]: BadgeProps['color'] } = {
    ACTIVE: 'green',
    BLOCK: 'red'
}

export enum Status {
    active = 'ACTIVE',
    block = 'BLOCK',
    hidden = 'HIDDEN'
}

export const order_status = {
    'Không thể sử dụng': 'orange',
    'Hết hạn': 'red',
    'Có thể sử dụng': 'blue'
}

export const product_label = {
    [Status.active]: 'Mở bán',
    [Status.block]: 'Khóa'
}
