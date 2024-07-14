import { CreateOrder } from 'common/dtos/create_order.dto'

export type NextStepToOrderingPayload = {
    actionId: string
    userId: string
    payload: {
        products: {
            id: string
            isSale?: boolean
            buy: number
            storeId: string
            price_after: number
            original_quantity: number
        }[]
        vouchers: {
            id: string
            storeId: string
        }[]
        orderIds: string[]
    }
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
    isSale: boolean
    currentSaleId?: string
}
