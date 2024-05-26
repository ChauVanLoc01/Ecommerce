import { VoucherStoreResponse } from 'src/types/voucher.type'
import { http } from './http'

export const VoucherFetching = {
    getVoucherByStoreId: (storeId: string) => {
        return http.get<VoucherStoreResponse>(`/store/voucher/user-store-voucher/${storeId}`)
    },
    getGlobalVoucher: () => {
        return http.get(`/store/voucher/user-store-voucher`)
    }
}
