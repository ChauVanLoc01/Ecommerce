import { Pagination } from './pagination.type'
import { Return } from './return.type'

export type Order = {
    id: string
    userId: string
    storeId: string
    total: number
    discount: number
    pay: number
    note?: string
    voucherId?: string
    deliveryInformationId: string
    status: string
    createdAt: string
    updatedAt?: string
}

export type OrderQuery = {
    status?: string
    createdAt?: string
    total?: string
    start_date?: string
    end_date?: string
} & Pagination

export type OrderListReponse = Return<{
    data: Order[]
    query: Omit<OrderQuery, 'page'> & { page: number; page_size: number }
}>

export type OrderFlow = {
    id: string
    status: string
    note?: string
    createdBy: string
    createdAt: string
    orderId: string
}
