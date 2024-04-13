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
}

const a = {
    username: 'admin',
    userId: 'e3946564-f776-4bf1-88a5-977611c9c94a',
    storeRoleId: null,
    createdBy: null,
    updatedBy: 'e3946564-f776-4bf1-88a5-977611c9c94a',
    createdAt: '2024-03-23T04:47:46.000Z',
    updatedAt: '2024-03-23T08:52:56.000Z'
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
