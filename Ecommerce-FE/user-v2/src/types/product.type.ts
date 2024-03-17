import { Status } from './auth.type'

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
}

export type Order = 'asc' | 'desc'

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

export type ProductDetailResponse = Product
