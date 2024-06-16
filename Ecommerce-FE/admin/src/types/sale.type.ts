export type ProductJoinSale = {
    productId: string
    quantity: number
    priceBefore: number
    priceAfter: number
}

export type JoinSalePromotion = {
    salePromotionId: string
    productIds: ProductJoinSale[]
}

export type SalePromotion = {
    id: string
    title: string
    description?: string
    type: string
    status: string
    startDate: Date
    endDate?: Date
    createdAt: Date
    createdBy: string
    updatedAt?: Date
    updatedBy?: string
}

export type ProductSalePromotion = {
    id: string
    storePromotionId: string
    productId: string
    quantity: number
    priceBefore: number
    priceAfter: number
    isDelete: boolean
    createdAt: Date
    createdBy: string
    updatedAt?: Date
    updatedBy?: string
}
