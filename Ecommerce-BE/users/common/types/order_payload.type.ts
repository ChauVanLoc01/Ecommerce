import { CreateOrder } from 'common/dtos/create_order.dto'

export type PayloadCache = CreateOrder
export type PayloadProcess = CreateOrder

export type UpdateOtherService = {
    products: {
        id: string
        storeId: string
        price_after: number
        buy: number
        remaining_quantity: number
        original_quantity: number
        salePromotionId?: string
        productPromotionId?: string
    }[]
    vouchers: {
        id: string
        storeId: string
    }[]
    orderIds: string[]
}
export type PayloadProduct = UpdateOtherService
export type PayloadVoucher = UpdateOtherService
export type RollbackOrder = UpdateOtherService
export type CommitSuccess = UpdateOtherService

type OrderKey = {
    check_cache: PayloadCache
    process_order: PayloadProcess
    update_product: PayloadProduct
    update_voucher: PayloadVoucher
    roll_back_product: RollbackOrder
    roll_back_order: RollbackOrder
    commit_success: CommitSuccess
}

export type CreateOrderPayload<T extends keyof OrderKey = keyof OrderKey> = {
    userId: string
    actionId: string
    payload: OrderKey[T]
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
    currentSaleId?: string
    status?: string
    name?: string
}
