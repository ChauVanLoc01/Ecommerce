import { JoinSalePromotion, SalePromotionDetailResponse, SalePromotionResponse } from 'src/types/sale.type'
import { http } from './http'

export const sale_api = {
    getSalePromotionDetail: (storePromotionId: string) => {
        return http.get<SalePromotionDetailResponse>(`/store/sale-promotion/${storePromotionId}`)
    },
    getSalePromotion: (date: string) => {
        return http.get<SalePromotionResponse>('/store/sale-promotion', {
            params: {
                date
            }
        })
    },
    joinSalePromotion: (body: JoinSalePromotion) => {
        return http.post('/store/sale-promotion', body)
    },
    removeSalePromotion: () => {
        return
    }
}
