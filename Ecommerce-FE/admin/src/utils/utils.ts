import { AxiosResponse, isAxiosError } from 'axios'
import { type ClassValue, clsx } from 'clsx'
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
