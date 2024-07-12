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
    }[]
    order: {
        [key in PayloadUpdateKey]: string[]
    }
}

export type CreateOrderPayload = {
    userId: string
    payload: PayloadUpdate
}
