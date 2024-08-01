import { Return } from 'src/types/return.type'
import { SearchVoucher, Voucher, VoucherStoreResponse, VoucherWithCondition } from 'src/types/voucher.type'
import { http } from './http'

export const VoucherFetching = {
    getVoucherByStoreId: (storeId: string) => {
        return http.get<VoucherStoreResponse>(`/store/voucher/user-store-voucher/${storeId}`)
    },
    getGlobalVoucher: () => {
        return http.get<Return<Voucher[]>>(`/store/voucher/global/user`)
    },
    searchVoucher: (body: SearchVoucher) => {
        return http.post<Return<boolean | VoucherWithCondition[]>>('/store/voucher/search-code', body)
    }
}
