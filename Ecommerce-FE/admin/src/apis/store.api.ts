import { OrderStatus } from 'src/constants/store.constants'
import { StoreDetail, StoreQuery, Stores } from 'src/types/store.type'
import { http } from './http'

export const store_api = {
    getStores: (params: StoreQuery) => () => {
        return http.get<Stores>('/store/store/all-store', { params })
    },
    getDetail: (storeId: string) => () => {
        return http.get<StoreDetail>(`/store/store/admin/${storeId}`)
    },
    updateStatusOfStore: (storeId: string) => (body: { status: OrderStatus }) => {
        return http.put(`/store/store/admin/${storeId}`, body)
    }
}
