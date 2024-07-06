import { Product } from './product.type'

export type OrderDelivery = {
    name: string
    address: string
}

export type OrderBody = {
    orders: {
        storeId: string
        voucherId?: string
        total: number
        discount: number
        pay: number
        productOrders: {
            productId: string
            priceAfter: number
            quantity: number
        }[]
    }[]
    globalVoucherId?: string
    actionId: string
    delivery_info: OrderDelivery
}
export type OrderQuery = {
    product_name?: string
    status?: string
    createdAt?: string
    total?: string
    start_date?: string
    end_date?: string
    limit?: number
    page?: number
}

export type Order = {
    id: string
    userId: string
    storeId: string
    total: number
    discount: number
    pay: number
    note?: string
    voucherId?: string
    deliveryInformationId: string
    isRated: number
    status: string
    createdAt: string
    updatedAt?: string
    numberOfRefund: number
}

export type ProductOrder = {
    id: string
    productId: string
    quantity: number
    priceBefore?: number
    priceAfter: number
    orderId: string
}

export type OrderFlow = {
    id: string
    status: string
    note: string
    createdBy: string
    createdAt: string
    orderId: string
}

export type OrderShipping = {
    id: string
    orderId: string
    name: string
    address: string
    type: string
    createdAt: string
    createdBy: string
    updatedAt?: string
}

export type OrderVoucher = {
    id: string
    orderId: string
    voucherId: string
    createdAt: string
}

export type ProductOrderWithProduct = ProductOrder &
    Pick<Product, 'name' | 'image' | 'category'> & { currentPriceAfter: number }

export type OrderResponse = {
    data: Order[]
    query: Omit<OrderQuery, 'page'> & { page_size: number; page: number }
}

export type OrderDetailResponse = Order & {
    OrderFlow: OrderFlow[]
    OrderShipping: OrderShipping[]
    OrderVoucher: OrderVoucher[]
    ProductOrder: (ProductOrder & Pick<Product, 'name' | 'image' | 'category'> & { current_price_after: number })[]
}
