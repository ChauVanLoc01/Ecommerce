import { NumberOfOrderAnalytic, ReceptAnalytic } from 'src/types/analytics.type'
import { http } from './http'

export const AnalyticApi = {
    receiptAnalytics: (dates: string[]) => {
        return http.post<ReceptAnalytic>('order/order/receipt-analytic', { dates })
    },
    numberOfOrderAnalytics: (dates: string[]) => {
        return http.post<NumberOfOrderAnalytic>('order/order/order-analytic', { dates })
    }
}
