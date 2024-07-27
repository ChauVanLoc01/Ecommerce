import { Return } from 'src/types/return.type'
import {
    GetProductOfSalePromotion,
    ProductSaleDetail,
    SalePromotionDetailList,
    SalePromotionIds
} from 'src/types/sale.type'
import { http } from './http'

export const sale_api = {
    current_sale_promotin: (salePromotionId: string) => () => {
        return http.get<GetProductOfSalePromotion>(`/store/sale-promotion/current-sale/${salePromotionId}`)
    },
    getSalePromotionIds: () => {
        return http.get<SalePromotionIds>('/store/sale-promotion/sale-promotion-in-day')
    },
    getProductOfSalePromotion: (salePromotionId: string) => () => {
        return http.get<GetProductOfSalePromotion>(`/store/sale-promotion/${salePromotionId}/product`)
    },
    getProductListSale: (salePromotionId: string, productIds: string[], signal?: AbortSignal) => {
        return http.get<SalePromotionDetailList>(`/store/sale-promotion/products/${salePromotionId}`, {
            params: { productIds },
            signal
        })
    },
    getProducSale: (salePromotionId: string, productId: string, signal?: AbortSignal) => {
        return http.get<Return<ProductSaleDetail>>(
            `/store/sale-promotion/product-sale/${salePromotionId}/product/${productId}`,
            {
                signal
            }
        )
    }
}
