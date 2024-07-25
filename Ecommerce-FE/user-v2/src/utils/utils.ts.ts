import { type ClassValue, clsx } from 'clsx'
import { endLoadingLoader, startLoadingLoader } from 'src/constants/event'
import { twMerge } from 'tailwind-merge'
import { ls } from './localStorage'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const convertCurrentcy = (value: number, digit = 0) =>
    `${new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: digit
    }).format(value)}đ`

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

export const loadingEvent = {
    start: (checkAuth = true) => {
        window.dispatchEvent(new Event(startLoadingLoader))
        if (checkAuth && !ls.getItem('profile')) {
            throw new Response('Unauthentication', { status: 401 })
        }
    },
    end: () => window.dispatchEvent(new Event(endLoadingLoader))
}

export const calcPercentRating = (total: number, value: number) => {
    return (value * 100) / total
}

export const sortObject = (obj: any) => {
    let sorted: { [key: string]: any } = {}
    let str: string[] = []
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key))
        }
    }
    str.sort()
    for (let key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
    }
    return sorted
}
