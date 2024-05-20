import { NumberOfOrderAnalytic, ReceptAnalytic } from 'src/types/analytics.type'
import { http } from './http'

export const AnalyticApi = {
    receiptAnalytics: (body: Date[]) => {
        return http.post<ReceptAnalytic>('order/order/receipt-analytic', body)
    },
    numberOfOrderAnalytics: (body: Date[]) => {
        return http.post<NumberOfOrderAnalytic>('order/order/order-analytic', body)
    }
}
