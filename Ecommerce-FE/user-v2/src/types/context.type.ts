import { LoginResponse } from './auth.type'
import { Product } from './product.type'

export type ProductContext = Product & { buy: number; checked: boolean }

export type AppContext = {
    profile?: LoginResponse
    setProfile: React.Dispatch<React.SetStateAction<LoginResponse | undefined>>
    products: ProductContext[]
    setProducts: React.Dispatch<React.SetStateAction<ProductContext[]>>
    previousPage: string
    setPreviousPage: React.Dispatch<React.SetStateAction<string>>
}
