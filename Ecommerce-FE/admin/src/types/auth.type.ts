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

export type LoginResponse = {
    user: User
    store: Store
    access_token: string
    refresh_token: string
}
