import { Status } from './auth.type'
import { Return } from './return.type'
import { Store } from './store.type'

export type Product = {
    id: string
    name: string
    image: string
    priceBefore: number
    priceAfter: number
    initQuantity: number
    currentQuantity: number
    sold: number
    description: string | null
    status: Status
    category: string
    createdBy: string
    updatedBy: string | null
    createdAt: string
    updatedAt: null
    deletedBy: string | null
    deletedAt: null
    storeId: string
    voucherId: string | null
    rate: number
    store: Store
}

export type Order = 'asc' | 'desc'

export type SalesPromotionType = {
    salePromotionId: string
    title: string
    description: string
    type: string
    startDate: string
    endDate: string
    createdAt?: string
    updateAt?: string
    updatedBy?: string
}

export type ProductListQuery = {
    category?: string
    createdAt?: Order
    sold?: Order
    price?: Order
    price_min?: number
    price_max?: number
    limit?: number
    page?: number
}

export type ProductListResponse = {
    data: Product[]
    query: ProductListQuery & { page_size: number }
}

export type ProductDetailResponse = Product & {
    productImages: { url: string }[]
    sale: { id: string; productId: string; quantity: number; bought: number; priceAfter: number }
}

export type RefreshProduct = {
    [storeId: string]: {
        [productId: string]: Product
    }
}

export type ProductSearch = Return<{
    scroll_id: string
    total: number
    data: Product[]
}>

export type SalesPromotion = Return<SalesPromotionType[]>

export type SalesPromotionAndProduct = {
    salesPromotion: SalesPromotionType
    productPromotion: []
}

export type ProductRating = {}
