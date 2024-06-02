import { ReactNode, createContext, useMemo, useState } from 'react'
import { LoginResponse } from 'src/types/auth.type'
import { AppContext as AppContextType, ProductContext } from 'src/types/context.type'
import { ls } from 'src/utils/localStorage'

const defaultValueContext: AppContextType = {
    profile: ls.getItem('profile') ? (JSON.parse(ls.getItem('profile') as string) as LoginResponse) : undefined,
    setProfile: () => {},
    products: ls.getItem('products')
        ? (JSON.parse(ls.getItem('products') as string) as ProductContext)
        : { length: 0, products: {} },
    setProducts: () => {},
    previousPage: '/',
    setPreviousPage: () => {},
    ids: undefined
}

export const AppContext = createContext<AppContextType>(defaultValueContext)

const ContextWrap = ({ children }: { children: ReactNode }) => {
    const [previousPage, setPreviousPage] = useState<string>('/')
    const [profile, setProfile] = useState<AppContextType['profile']>(defaultValueContext.profile)
    const [products, setProducts] = useState<AppContextType['products']>(defaultValueContext.products)

    const ids = useMemo(() => {
        if (!products.products || !Object.keys(products.products).length) {
            return undefined
        }

        const ids: {
            storeIds: string[]
            all: string[]
            checked: string[]
        } = Object.keys(products.products).reduce(
            (
                acum: {
                    storeIds: string[]
                    all: string[]
                    checked: string[]
                },
                storeId
            ) => {
                return {
                    storeIds: [...acum.storeIds, storeId],
                    all: [...acum.all, ...products.products[storeId].map((e) => e.productId)],
                    checked: [
                        ...acum.checked,
                        ...products.products[storeId].filter((e) => e.checked).map((e) => e.productId)
                    ]
                }
            },
            { storeIds: [], all: [], checked: [] }
        )

        return ids
    }, [products])

    return (
        <AppContext.Provider
            value={{
                profile,
                setProfile,
                products,
                setProducts,
                previousPage,
                setPreviousPage,
                ids
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default ContextWrap
