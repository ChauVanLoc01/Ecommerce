import { AxiosResponse } from 'axios'
import { OrderBody, OrderResponse } from 'src/types/order.type'
import { http } from './http'

export const OrderFetching = {
    order: (body: OrderBody) => {
        return http.post<OrderResponse, AxiosResponse<OrderResponse>, OrderBody>('/order/order/user-order', body)
    }
}
