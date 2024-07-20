import { Return } from './return.type'

export type AnalyticType = 'day' | 'weekInMonth' | 'monthInYear'

export type ReceptAnalytic = Return<{
    receipts: { date: string; total: number }[]
    current: number
    percent: number
}>

export type NumberOfOrderAnalytic = Return<{
    orders: { date: string; total: number }[]
    current: number
    percent: number
}>
