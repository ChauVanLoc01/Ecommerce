import { Return } from 'src/types/return.type'
import { Voucher, VoucherDetailReponse, VoucherListReponse, VoucherQuery } from 'src/types/voucher.type'
import { CreateVoucher, UpdateVoucher } from 'src/utils/voucher.schema'
import { http } from './http'

export const VoucherApi = {
    getDetailVoucher: (voucherId: string) => {
        return http.get<VoucherDetailReponse>(`/store/voucher/${voucherId}`)
    },
    getAllVoucher: (query: VoucherQuery) => {
        return http.get<VoucherListReponse>('store/voucher', {
            params: query
        })
    },
    createVoucher: (body: CreateVoucher) => {
        return http.post<Return<VoucherDetailReponse>>('store/voucher', body)
    },
    updateVoucher: (body: UpdateVoucher) => {
        return http.put<Return<Voucher>>('store/voucher', body)
    }
}
