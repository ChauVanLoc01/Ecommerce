import { Product } from './product.type'
import { Return } from './return.type'

export type ProductJoinSale = {
    productId: string
    name: string
    image: string
    quantity: number
    priceAfter: number
    category: string
}

export type JoinSalePromotion = {
    salePromotionId: string
    storePromotionId?: string
    products: ProductJoinSale[]
}

export type SalePromotion = {
    id: string
    title: string
    description?: string
    type: string
    status: string
    startDate: string
    endDate: string
    createdAt: string
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

export type StoreWithProductSalePromotion = StoreSalePromotion & { ProductPromotion: ProductSalePromotion[] }

export type SalePromotionResponse = Return<{
    promotions: SalePromotion[]
    storePromotions: StoreWithProductSalePromotion[]
}>

export type SalePromotionDetailResponse = Return<ProductSalePromotion[]>

export type UpdateProductSaleBody = {
    productPromotions: {
        productPromotionId: string
        isDelete?: boolean
        quantity?: number
        priceAfter?: number
    }[]
}

export type ProductSaleMix = Product & {
    quantityInSale: number
    priceBeforeInSale: number
    priceAfterInSale: number
    productSaleId?: string
    isChecked?: boolean
}
