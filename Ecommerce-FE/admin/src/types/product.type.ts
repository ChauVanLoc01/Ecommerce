import { Pagination } from './pagination.type'
import { Return } from './return.type'

type Order = 'asc' | 'desc'

export type ProductQuery = Partial<{
    search_key: string
    category: string
    createdAt: Order
    sold: Order
    price: Order
    price_min: number
    price_max: number
    min_date: string
    max_date: string
    status: string
}>

export type ProductQueryAndPagination = ProductQuery & Pagination

export type Product = {
    id: string
    name: string
    image: string
    priceBefore: number
    priceAfter: number
    initQuantity: number
    currentQuantity: number
    sold: number
    description?: string
    status: string
    category: string
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt?: string
    deletedBy?: string
    deletedAt?: string
    storeId: string
    voucherId?: string
    rate?: number
}

export type ProductListResponse = Return<{
    data: Product[]
    query: Omit<ProductQueryAndPagination, 'page'> & {
        page: number
        page_size: number
    }
}>

export type ProductAnalyticResponse = Return<{
    all: number
    active: number
    block: number
    deleted: number
}>

export type Category = {
    shortname: string
    name: string
    description?: string
}

export type CategoryResponse = Return<Category[]>

export type UpdateProductBody = Partial<{
    name: string
    category: string
    initQuantity: number
    priceBefore: number
    priceAfter: number
    description: string
    status: string
}>

export type ProductOrder = {
    id: string
    productId: string
    quantity: number
    priceBefore?: number
    priceAfter: number
    orderId: string
}

export type ProductOrderReponse = Return<(ProductOrder & { Product: Product })[]>
