export type OrderBody = {
    orderParameters: {
        storeId: string
        orders: {
            productId: string
            price_after: number
            quantity: number
        }[]
    }[]
    deliveryInformationId: string
}

export type OrderResponse = {
    id: string
    userId: string
    storeId: string
    total: number
    discount: number
    pay: number
    note?: string
    voucherId?: string
    deliveryInformationId: string
    status: string
    createdAt: string
    updatedAt?: string
}
