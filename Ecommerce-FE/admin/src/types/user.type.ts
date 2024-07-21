import { User } from './auth.type'
import { Pagination } from './pagination.type'
import { Return } from './return.type'

export type UserQuery = Partial<Pick<User, 'status'> & { start_date: Date; end_date: Date; search_key: string }> &
    Pagination

export type Users = Return<{
    data: User[]
    query: UserQuery
}>
