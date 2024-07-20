import { User } from './auth.type'
import { Pagination } from './pagination.type'
import { Return } from './return.type'

export type UserQuery = Partial<Pick<User, 'full_name' | 'status' | 'email'> & { start_date: Date; end_date: Date }> &
    Pagination

export type Users = Return<{
    data: User[]
    query: UserQuery
}>
