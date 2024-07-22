import { Store } from './auth.type'
import { Pagination } from './pagination.type'
import { Return } from './return.type'

export type StoreQuery = Partial<Pick<Store, 'status'> & { start_date: Date; end_date: Date; search_key: string }> &
    Pagination

export type Stores = Return<{
    data: Store[]
    query: StoreQuery
}>

export type StoreDetail = Return<{
    employee_count: number
    product_count: number
}>

export type IsThereStore = Return<Pick<Store, 'id' | 'name' | 'image' | 'location'> | null>
