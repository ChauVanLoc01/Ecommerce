import { GenericAbortSignal } from 'axios'
import {
    CreateOrderRefund,
    Order,
    OrderBody,
    OrderDetailResponse,
    OrderQuery,
    OrderResponse,
    UpdateOrderStatus
} from 'src/types/order.type'
import { Payment } from 'src/types/payment.type'
import { Return } from 'src/types/return.type'
import { http } from './http'

export const OrderFetching = {
    order: (body: OrderBody) => {
        return http.post<Return<Order[]>>('/order/order/user-order', body)
    },
    getAllOrder: (query: OrderQuery, signal?: GenericAbortSignal) => {
        return http.get<Return<OrderResponse>>('order/order/user-order', {
            params: query,
            signal
        })
    },
    getOrderDetail: (orderId: string, signal?: GenericAbortSignal) => {
        return http.get<Return<OrderDetailResponse>>(`order/order/user-order/${orderId}`, {
            signal
        })
    },
    cancelOrder: (orderId: string) => {
        return http.put(`order/order/user-order/${orderId}`, { status: 'CANCEL' })
    },
    updateStatusOrder: (orderId: string) => (body: UpdateOrderStatus) => {
        return http.put(`order/order/${orderId}/status`, body)
    },
    requestRefund: (orderId: string) => (body: CreateOrderRefund) => {
        return http.post(`order/order/${orderId}/refund`, body)
    },
    createTransaction: (body: { amount: number; bankCode: Payment }) => () => {
        return http.post<string>('order/payment', body)
    }
}
