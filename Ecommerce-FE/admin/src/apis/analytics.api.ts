import { AnalyticType, NumberOfOrderAnalytic, OrderAnalytic, ReceptAnalytic } from 'src/types/analytics.type'
import { Return } from 'src/types/return.type'
import { http } from './http'

export const AnalyticApi = {
    takingAnalytics: (type: AnalyticType) => () => {
        return http.get<ReceptAnalytic>(`order/order/taking-analytic/${type}`)
    },
    orderAnalytics: (type: AnalyticType) => () => {
        return http.get<OrderAnalytic>(`order/order/order-analytic/${type}`)
    },
    numberOfOrderAnalytics: (type: AnalyticType) => () => {
        return http.post<NumberOfOrderAnalytic>(`order/order/order-analytic/${type}`)
    },
    countUserViewStore: (type: AnalyticType) => () => {
        return http.get<Return<{ start: Date; end: Date; list: { userId?: string }[] }[]>>(
            `store/store/count-view/${type}`
        )
    },
    top10ViewProduct: () => {
        return http.get<{ productId: string; name: string; count: number; image: string }[]>(
            'product/product/top-10-view'
        )
    },
    ratingOfBestSell: () => {
        return http.get<{ productId: string; count: number; quantity: number }[]>('/order/order/best-sell')
    },
    getProductDetail: (productId: string) => () => {
        return http.get<{ name: string; image: string }>(`/product/product/best-sell/${productId}`)
    },
    customerRating: (type: AnalyticType) => () => {
        return http.get<{
            count: number
            data: { order: { id: string; userId: string }; start: Date; total: number; percent: number }[]
        }>(`/order/order/customer-rate/${type}`)
    }
}
