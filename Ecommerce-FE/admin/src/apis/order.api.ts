import { OrderListReponse, OrderQuery } from 'src/types/order.type'
import { http } from './http'

export const OrderApi = {
    getAllOrder: (query: OrderQuery) => {
        return http.get<OrderListReponse>('order/order/store-order', {
            params: query
        })
    }
}
