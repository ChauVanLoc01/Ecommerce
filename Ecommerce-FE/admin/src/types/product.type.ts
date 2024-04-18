import { Pagination } from './pagination.type'
import { Return } from './return.type'

type Order = 'asc' | 'desc'

export type ProductQuery = Partial<{
    category: string
    createdAt: Order
    sold: Order
    price: Order
    price_min: number
    price_max: number
    min_date: string
    max_date: string
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
