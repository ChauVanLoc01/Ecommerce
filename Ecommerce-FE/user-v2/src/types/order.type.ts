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

export type OrderQuery = {
    product_name?: string
    status?: string
    createdAt?: string
    total?: string
    start_date?: string
    end_date?: string
    limit?: number
    page?: number
}

export type Order = {
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

export type OrderResponse = {
    data: Order[]
    query: Omit<OrderQuery, 'page'> & { page_size: number; page: number }
}
