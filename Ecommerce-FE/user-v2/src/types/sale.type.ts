import { Product } from './product.type'
import { Return } from './return.type'

export type SalePromotion = {
    id: string
    title: string
    description?: string
    type: string
    status: string
    startDate: string
    endDate: string
    createdAt: Date
    createdBy: string
    updatedAt?: Date
    updatedBy?: string
}

export type StorePromotion = {
    id: string
    salePromotionId: string
    storeId: string
    status: string
    createdAt: Date
    createdBy: string
    updatedAt?: Date
    updatedBy?: string
}

export type ProductPromotion = {
    id: string
    productId: string
    quantity: number
    bought: number
    priceAfter: number
    isDelete: boolean
    createdAt: string
    createdBy: string
    updatedAt?: Date
    updatedBy?: string
    storePromotionId: string
    salePromotionId: string
}

export type CurrentSalePromotion = Return<{
    salePromotion: SalePromotion
    productPromotions: (ProductPromotion & Pick<Product, 'name' | 'image'>)[]
}>
