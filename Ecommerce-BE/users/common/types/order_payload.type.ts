import { CreateOrder } from 'common/dtos/create_order.dto'

type PayloadUpdateKey =
    | 'orderIds'
    | 'productOrderIds'
    | 'shippingOrderIds'
    | 'orderFlowIds'
    | 'voucherOrderIds'

export type PayloadUpdate = {
    products: {
        id: string
        isSale?: boolean
        buy: number
        storeId: string
        price_after: number
    }[]
    vouchers: {
        id: string
        storeId: string
    }[]
    order: {
        [key in PayloadUpdateKey]: string[]
    }
}

export type OrderStep = CreateOrderPayload<CreateOrder>

export type ProductStep = CreateOrderPayload<PayloadUpdate & Pick<CreateOrder, 'actionId'>>

export type VoucherStep = CreateOrderPayload<{
    actionId: CreateOrder['actionId']
    products: (PayloadUpdate['products'][number] & { original_quantity: number })[]
    vouchers: PayloadUpdate['vouchers']
    order: PayloadUpdate['order']
}>

export type CreateOrderPayload<T> = {
    userId: string
    payload: T
}

export type OrderStatusPayload = {
    id: string
    msg: string
    action: boolean
    result: string[] | null
}

export type Update_Voucher_WhenCreatingOrderPayload = {
    voucherId: string
    storeId: string
    quantity: number
}

export type Update_Product_WhenCreatingOrderPayload = {
    productId: string
    storeId: string
    quantity: number
    priceAfter: number
}
