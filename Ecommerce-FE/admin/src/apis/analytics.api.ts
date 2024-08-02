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
    }
}
