export type ProfileResponse = {
    id: string
    full_name: string
    birthday: string
    email: string
    address: string
    rankId: null
    role: string
    status: string
    createdAt: string
    updatedAt: null
    image?: string
}

export type ChangePasswordResponse = {
    username: string
    userId: string
    storeRoleId?: string
    createdBy?: string
    updatedBy: string
    createdAt: string
    updatedAt: string
}
