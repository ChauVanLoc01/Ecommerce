import { Return } from 'src/types/return.type'
import { Voucher, VoucherDetailReponse, VoucherListReponse, VoucherQuery } from 'src/types/voucher.type'
import { CreateVoucher, UpdateVoucher } from 'src/utils/voucher.schema'
import { http } from './http'

export const VoucherApi = {
    getDetailVoucher: (voucherId: string) => {
        return http.get<VoucherDetailReponse>(`/store/voucher/${voucherId}`)
    },
    getAllVoucher: (query: VoucherQuery) => () => {
        return http.get<VoucherListReponse>('store/voucher', {
            params: query
        })
    },
    createVoucher: (body: CreateVoucher) => {
        return http.post<Return<VoucherDetailReponse>>('store/voucher', body)
    },
    updateVoucher: (voucherId: string) => (body: UpdateVoucher) => {
        return http.put(`store/voucher/${voucherId}`, body)
    },
    getAnalytics: () => {
        return http.get<Return<{ all: number; active: number; block: number }>>('store/voucher/analytics')
    },
    updateStatus: (voucherId: string, status: 'ACTIVE' | 'BLOCK') => () => {
        return http.put(`store/voucher/${voucherId}`, { status })
    },
    getGlobalVoucher: (query: VoucherQuery) => () => {
        return http.get<VoucherListReponse>('store/voucher/global', {
            params: query
        })
    },
    getConditionalCategory: (id: string) => () => {
        return http.get<Return<string>>(`store/voucher/category/${id}`)
    },
    getConditionalPrice: (id: string) => () => {
        return http.get(`store/voucher/price/${id}`)
    }
}
