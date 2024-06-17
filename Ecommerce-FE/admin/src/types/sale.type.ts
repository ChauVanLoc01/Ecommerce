import { Return } from './return.type'

export type ProductJoinSale = {
    productId: string
    quantity: number
    priceAfter: number
}

export type JoinSalePromotion = {
    salePromotionId: string
    products: ProductJoinSale[]
}

export type SalePromotion = {
    id: string
    title: string
    description?: string
    type: string
    status: string
    startDate: Date
    endDate: Date
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

export type StoreSalePromotion = {
    id: string
    salePromotionId: string
    storeId: string
    status: string
    createdAt: Date
    createdBy: string
    updatedAt?: Date
    updatedBy?: string
}

export type SalePromotionResponse = Return<{
    promotions: SalePromotion[]
    storePromotions: StoreSalePromotion[]
}>

export type SalePromotionDetailResponse = Return<ProductSalePromotion[]>
