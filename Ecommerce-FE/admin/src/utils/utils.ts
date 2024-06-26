import { Row } from '@tanstack/react-table'
import { AxiosResponse, isAxiosError } from 'axios'
import { type ClassValue, clsx } from 'clsx'
import {
    addHours,
    eachDayOfInterval,
    eachMonthOfInterval,
    eachWeekOfInterval,
    isAfter,
    isPast,
    startOfMonth,
    startOfYear
} from 'date-fns'
import { ProductStatus, Status } from 'src/constants/product.status'
import { Voucher } from 'src/types/voucher.type'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export const convertCurrentcy = (value: number, isPrefix = true) => {
    if (!isPrefix) {
        return new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 0
        }).format(value)
    }
    return `${new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 0
    }).format(value)}đ`
}

export const convertDigitalNumber = (value: number, digit = 0) =>
    new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: digit
    }).format(value)

export const removeSpecialCharacter = (str: string) =>
    str
        .replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')
        .split(' ')
        .join('-')

export const checkAxiosError = (
    response: unknown
): response is AxiosResponse<{ error: string; message: string; statusCode: number }> => {
    return isAxiosError(response)
}

export const checkExpired = ({ original: { status, endDate } }: Row<Voucher>) => {
    return status === Status.block ? 'Không thể sử dụng' : isPast(endDate) ? 'Hết hạn' : 'Có thể sử dụng'
}

export const timeInterval: () => {
    monthInterval: string[]
    weekInterval: string[]
    dayInterval: string[]
} = () => {
    const monthInterval = eachMonthOfInterval({
        start: startOfYear(new Date()),
        end: new Date()
    }).map((e) => addHours(e, 7).toISOString())

    const weekInterval = eachWeekOfInterval({
        start: startOfMonth(new Date()),
        end: new Date()
    }).map((e) => addHours(e, 31).toISOString())

    const dayInterval = eachDayOfInterval({
        start: startOfMonth(new Date()),
        end: new Date()
    }).map((e) => addHours(e, 7).toISOString())

    return {
        monthInterval,
        weekInterval,
        dayInterval
    }
}
