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
