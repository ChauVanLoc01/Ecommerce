import { type ClassValue, clsx } from 'clsx'
import { cloneDeep } from 'lodash'
import { endLoadingLoader, startLoadingLoader } from 'src/constants/event'
import { ProductCart, ProductOrder, ProductOrderSale } from 'src/types/context.type'
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

export const removeSpecialCharacter = (str = '') =>
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

export const clearProductAfterCreatingOrder = (checkedStoreIds: string[], payload: ProductCart): ProductCart => {
    const { stores } = payload
    checkedStoreIds = checkedStoreIds || []
    checkedStoreIds.forEach((storeId) => {
        let productInStore = stores?.[storeId]?.products || []
        console.log('productInStore', productInStore)
        productInStore.forEach((product) => {
            let { productId, isChecked } = product
            if (isChecked) {
                payload.total -= 1
                productInStore.delete(productId)
                stores[storeId].checked -= 1
                if (productInStore.size == 0) {
                    delete stores[storeId]
                }
            }
        })
    })

    return cloneDeep(payload)
}

export const isProductSale = (product: ProductOrder | ProductOrderSale): product is ProductOrderSale => {
    return 'sale' in product
}
