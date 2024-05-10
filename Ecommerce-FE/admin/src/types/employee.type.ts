import { Account, StoreRole, User } from './auth.type'
import { Pagination } from './pagination.type'
import { Return } from './return.type'

export type Employee = User

export type EmployeeQuery = {
    status?: string
    createdAt?: string
    start_date?: string
    end_date?: string
} & Pagination

export type EmployeeList = Account & {
    StoreRole: StoreRole
    User_Account_userIdToUser: User
}

export type EmployeeListResponse = Return<{
    data: EmployeeList[]
    query: Omit<EmployeeQuery, 'page'> & { page_size: number; page: number }
}>

export type CreateEmployeeResponse = Return<{
    profile: User
    account: Account
    storeRole: StoreRole
}>

export type AnalyticsEmployee = Return<{ all: number; actives: number; blocks: number }>
