import { BadgeProps } from '@radix-ui/themes'

export type OrderStatus = 'ACTIVE' | 'BLOCK' | 'DEFAULT'

export const OrderLabel: Record<OrderStatus, string> = {
    DEFAULT: 'Tất cả',
    BLOCK: 'Đã bị khóa',
    ACTIVE: 'Đang hoạt động'
}

export const OrderColor: Record<OrderStatus, BadgeProps['color']> = {
    DEFAULT: 'gray',
    BLOCK: 'red',
    ACTIVE: 'green'
}
