import { Return } from './return.type'

export type AnalyticType = 'day' | 'week' | 'month'

export const analytics: { key: AnalyticType; label: string }[] = [
    {
        key: 'day',
        label: 'Ngày'
    },
    {
        key: 'week',
        label: 'Tuần'
    },
    {
        key: 'month',
        label: 'Tháng'
    }
]

export type ReceptAnalytic = Return<{
    data: {
        id: string
        total: number
        pay: number
        discount: number
    }[][]
    times: { start: Date; end: Date }[]
}>
export type OrderAnalytic = Return<{
    data: {
        id: string
        status: string
    }[][]
    times: { start: Date; end: Date }[]
}>

export type NumberOfOrderAnalytic = Return<{
    orders: { date: string; total: number }[]
    current: number
    percent: number
}>
