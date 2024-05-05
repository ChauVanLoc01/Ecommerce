import { Return } from 'src/types/return.type'
import { Store } from 'src/types/store.type'
import { http } from './http'

export const StoreFetching = {
    getStoreDetail: (storeId: string) => {
        return http.get<Return<Store>>(`/store/store/${storeId}`)
    }
}
