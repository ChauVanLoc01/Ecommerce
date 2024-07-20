import { Store } from './auth.type'
import { Pagination } from './pagination.type'
import { Return } from './return.type'

export type StoreQuery = Partial<
    Pick<Store, 'id' | 'name' | 'status' | 'location'> & { start_date: Date; end_date: Date }
> &
    Pagination

export type Stores = Return<{
    data: Store[]
    query: StoreQuery
}>
