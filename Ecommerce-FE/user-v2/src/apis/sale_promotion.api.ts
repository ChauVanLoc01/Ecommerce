import { GetProductOfSalePromotion, SalePromotionIds } from 'src/types/sale.type'
import { http } from './http'

export const sale_api = {
    current_sale_promotin: () => {
        return http.get<GetProductOfSalePromotion>('/store/sale-promotion/current-sale')
    },
    getSalePromotionIds: () => {
        return http.get<SalePromotionIds>('/store/sale-promotion/sale-promotion-in-day')
    },
    getProductOfSalePromotion: (salePromotionId: string) => () => {
        return http.get<GetProductOfSalePromotion>(`/store/sale-promotion/${salePromotionId}/product`)
    }
}
