import { Return } from 'src/types/return.type'
import { SearchVoucher, VoucherStoreResponse, VoucherWithCondition } from 'src/types/voucher.type'
import { http } from './http'

export const VoucherFetching = {
    getVoucherByStoreId: (storeId: string) => {
        return http.get<VoucherStoreResponse>(`/store/voucher/user-store-voucher/${storeId}`)
    },
    getGlobalVoucher: () => {
        return http.get(`/store/voucher/user-store-voucher`)
    },
    searchVoucher: (body: SearchVoucher) => {
        return http.post<Return<boolean | VoucherWithCondition[]>>('/store/voucher/search-code', body)
    }
}
