export type Delivery = {
    id: string
    full_name: string
    phone: string
    address: string
    isPrimary: boolean
    userId: string
    createdAt: string
}

export type DeliveryBody = {
    full_name: string
    address: string
    phone: string
    isPrimary?: boolean
}
