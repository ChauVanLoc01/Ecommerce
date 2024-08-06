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
    name: string
    productId: string
    image: string
    quantity: number
    bought: number
    priceAfter: number
}

export type CurrentSalePromotion = Return<{
    salePromotion: SalePromotion
    productPromotions: (ProductPromotion & Pick<Product, 'name' | 'image'>)[]
}>

export type SalePromotionIds = Return<
    {
        id: string
        startDate: string
        endDate: string
        title: string
    }[]
>

export type GetProductOfSalePromotion = Return<{
    data: {
        salePromotion: SalePromotion
        productPromotions: ProductPromotion[]
    }
    query: {
        search?: string
        category?: string
        page: number
        page_size: number
    }
}>

export type SalePromotionDetail = {
    id: string
    currentQuantity: number
    priceAfter: number
}

export type SalePromotionDetailList = Return<{
    [storeId: string]: {
        [productId: string]: SalePromotionDetail
    }
} | null>

export type ProductSaleDetail = {
    currentQuantity: number
    priceAfter: number
    id: string
}
