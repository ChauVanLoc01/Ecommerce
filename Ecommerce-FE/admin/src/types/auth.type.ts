export type User = {
    id: string
    full_name: string
    birthday?: string
    email: string
    address?: string
    rankId?: string
    role: string
    status: string
    createdAt: string
    updatedAt?: string
}

export type Store = {
    id: string
    name: string
    image: string
    location?: string
    description?: string
    status: string
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt?: string
}

export type Role = 'ADMIN' | 'EMPLOYEE'

export type LoginResponse = {
    role: Role
    user: User
    store: Store
    access_token: string
    refresh_token: string
}

export type StoreRole = {
    id: string
    storeId: string
    status: string
    role: string
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt?: string
}

export type Account = {
    username: string
    password: string
    userId: string
    storeRoleId: string
    createdBy: string
    updatedBy?: string
    createdAt: string
    updatedAt?: string
}
