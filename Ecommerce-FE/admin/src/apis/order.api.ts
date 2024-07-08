import {
    Order,
    OrderDetailResponse,
    OrderFlow,
    OrderListReponse,
    OrderQuery,
    UpdateOrderStatus
} from 'src/types/order.type'
import { Return } from 'src/types/return.type'
import { http } from './http'

export const OrderApi = {
    getAllOrder: (query: OrderQuery) => {
        return http.get<OrderListReponse>('order/order/store-order', {
            params: query
        })
    },
    getOrderDetail: (orderId: string) => {
        return http.get<Return<OrderDetailResponse>>(`order/order/store-order/${orderId}`)
    },
    getOrderStatus: (orderId: string) => () => {
        return http.get<Return<OrderFlow[]>>(`order/order/store-order-status/${orderId}`)
    },
    updateStatusOrder: (orderId: string) => (body: UpdateOrderStatus) => {
        return http.put(`order/order/${orderId}/status`, body)
    },
    analyticOrderStore: () => {
        return http.get<
            Return<{ all: number; success: number; waiting_confirm: number; shipping: number; cancel: number }>
        >('order/order/store-order-analytics')
    }
}
