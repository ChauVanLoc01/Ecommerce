export type Store = {
    id: string
    name: string
    image: string
    location?: string
    description?: string
    status: string
    createdBy?: string
    updatedBy?: string
    createdAt?: string
    updatedAt?: string
}

export type RefreshStore = { [key: string]: Store }
