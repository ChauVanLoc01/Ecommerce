export type SocketReturn<T> = {
    msg: string
    action: boolean
    result: T
}

export type ProductSocket = {
    storeId: string
    productId: string
    quantity: number
    priceAfter: number
}

export type VoucherSocket = {
    storeId: string
    voucherId: string
    quantity: number
}
