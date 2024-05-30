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
        }[]
    }
}

export type ProductContextExtends = ProductContext['products'][string][0] &
    Partial<Pick<Product, 'currentQuantity' | 'priceBefore'>>

export type AppContext = {
    profile?: LoginResponse
    setProfile: React.Dispatch<React.SetStateAction<LoginResponse | undefined>>
    products: ProductContext
    setProducts: React.Dispatch<React.SetStateAction<ProductContext>>
    previousPage: string
    setPreviousPage: React.Dispatch<React.SetStateAction<string>>
}
