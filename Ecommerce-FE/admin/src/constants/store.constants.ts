import { BadgeProps } from '@radix-ui/themes'

export type OrderStatus = 'ACTIVE' | 'BLOCK'

export const OrderLabel: Record<OrderStatus, string> = {
    BLOCK: 'Đã bị khóa',
    ACTIVE: 'Đang hoạt động'
}

export const OrderColor: Record<OrderStatus, BadgeProps['color']> = {
    BLOCK: 'red',
    ACTIVE: 'green'
}
