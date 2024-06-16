import { http } from './http'

export const sale_api = {
    getSalePromotionDetail: (storePromotionId: string) => {
        return http.get(`/store/sale-promotion/${storePromotionId}`)
    },
    getSalePromotion: (date: string) => {
        return http.get('/store/sale-promotion', {
            params: {
                date
            }
        })
    },
    joinSalePromotion: () => {
        return http.post('/store/sale-promotion')
    }
}
