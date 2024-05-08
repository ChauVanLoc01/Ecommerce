import { LoginResponse } from 'src/types/auth.type'
import { OrderListReponse, OrderQuery } from 'src/types/order.type'
import { ls } from 'src/utils/localStorage'
import { http } from './http'

const storeId = (JSON.parse(ls.getItem('profile') as string) as LoginResponse).store.id

export const OrderApi = {
    getAllOrder: (query: OrderQuery) => {
        return http.get<OrderListReponse>('order/order/store-order', {
            params: query
        })
    }
}
