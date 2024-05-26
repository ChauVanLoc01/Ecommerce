import { Return } from 'src/types/return.type'
import { RefreshStore, Store } from 'src/types/store.type'
import { http } from './http'

export const StoreFetching = {
    getStoreDetail: (storeId: string) => {
        return http.get<Return<Store>>(`/store/store/${storeId}`)
    },
    refreshStore: (body: string[]) => {
        return http.post<Return<RefreshStore>>('/store/store/user-store', { storesId: body })
    }
}
