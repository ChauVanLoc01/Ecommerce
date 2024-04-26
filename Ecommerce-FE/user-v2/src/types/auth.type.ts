export type Status = 'BLOCK' | 'ACTIVE'

export type LoginBody = {
    username: string
    password: string
}

export type LoginResponse = {
    user: {
        id: string
        full_name: string
        birthday: string
        email: string
        address: string | null
        rankId: string | null
        role: string
        status: Status
        createdAt: string
        updatedAt: string
        storeRoleId: string | undefined
        image: string
    }
    access_token: string
    refresh_token: string
}

export type RegisterBody = {
    full_name: string
    email: string
    username: string
    password: string
}

export type RegisterResponse = LoginResponse

export type RegisterStoreResponse = {
    id: string
    name: string
    image: string
    location: string
    description?: string
    status: string
    createdBy: string
    updatedBy?: string
    createdAt: Date
    updatedAt?: string
}
