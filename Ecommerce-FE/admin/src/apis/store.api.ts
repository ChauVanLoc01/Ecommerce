import { OrderStatus } from 'src/constants/store.constants'
import { StoreQuery, Stores } from 'src/types/store.type'
import { http } from './http'

export const store_api = {
    getStores: (params: StoreQuery) => () => {
        return http.get<Stores>('/store/store', { params })
    },
    updateStatusOfStore: (storeId: string) => (body: { status: OrderStatus }) => {
        return http.put(`/store/store/${storeId}`, body)
    }
}
