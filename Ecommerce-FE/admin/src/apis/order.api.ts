import { OrderFlow, OrderListReponse, OrderQuery } from 'src/types/order.type'
import { Return } from 'src/types/return.type'
import { http } from './http'

export const OrderApi = {
    getAllOrder: (query: OrderQuery) => {
        return http.get<OrderListReponse>('order/order/store-order', {
            params: query
        })
    },
    getOrderDetail: (orderId: string) => {
        return http.get(`order/order/store-order/${orderId}`)
    },
    getOrderStatus: (orderId: string) => {
        return http.get<Return<OrderFlow[]>>(`order/order/store-order-status/${orderId}`)
    },
    updateStatusOrder: (body: { status: string; note?: string; orderId: string }) => {
        const { orderId, ...rest } = body
        return http.put(`order/order/store-order/${orderId}`, { ...rest })
    },
    analyticOrderStore: () => {
        return http.get<
            Return<{ all: number; success: number; waiting_confirm: number; shipping: number; cancel: number }>
        >('order/order/store-order-analytics')
    }
}
