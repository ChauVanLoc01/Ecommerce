import { Socket } from 'socket.io-client'
import { LoginResponse } from './auth.type'
import { Product } from './product.type'

export type ProductContext = {
    length: number
    products: {
        [storeId: string]: {
            buy: number
            productId: string
            name: string
            image: string
            priceAfter: number
            checked: boolean
            isExist: boolean
        }[]
    }
}

export type ProductContextExtends = ProductContext['products'][string][0] & Product

export type ProductConvert = {
    [storeId: string]: {
        [productId: string]: ProductContextExtends
    }
}

export type AppContext = {
    profile?: LoginResponse
    setProfile: React.Dispatch<React.SetStateAction<LoginResponse | undefined>>
    products: ProductContext
    setProducts: React.Dispatch<React.SetStateAction<ProductContext>>
    previousPage: string
    setPreviousPage: React.Dispatch<React.SetStateAction<string>>
    ids:
        | {
              all: string[]
              checked: string[]
              storeIds: string[]
              storeCheckedIds: string[]
          }
        | undefined
    isCanOrder: boolean
    actionId: string
    socket?: Socket<any, any>
}
