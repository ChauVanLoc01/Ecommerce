import { AnalyticType, NumberOfOrderAnalytic, ReceptAnalytic } from 'src/types/analytics.type'
import { http } from './http'

export const AnalyticApi = {
    receiptAnalytics: (type: AnalyticType) => () => {
        return http.post<ReceptAnalytic>(`order/order/receipt-analytic${type}`)
    },
    numberOfOrderAnalytics: (type: AnalyticType) => () => {
        return http.post<NumberOfOrderAnalytic>(`order/order/order-analytic/${type}`)
    }
}
