import { Order, OrderBody, OrderQuery, OrderResponse } from 'src/types/order.type'
import { Return } from 'src/types/return.type'
import { http } from './http'

export const OrderFetching = {
    order: (body: OrderBody) => {
        return http.post<Return<Order[]>>('/order/order/user-order', body)
    },
    getAllOrder: (query: OrderQuery) => {
        return http.get<Return<OrderResponse>>('order/order/user-order', {
            params: query
        })
    }
}
