import { ReactNode, createContext, useMemo, useRef, useState } from 'react'
import useSocket from 'src/hooks/useSocket'
import { LoginResponse } from 'src/types/auth.type'
import { AppContext as AppContextType, ProductContext } from 'src/types/context.type'
import { ls } from 'src/utils/localStorage'
import { v7 as uuidv7 } from 'uuid'

const defaultValueContext: AppContextType = {
    profile: ls.getItem('profile') ? (JSON.parse(ls.getItem('profile') as string) as LoginResponse) : undefined,
    setProfile: () => {},
    products: ls.getItem('products')
        ? (JSON.parse(ls.getItem('products') as string) as ProductContext)
        : { length: 0, products: {} },
    setProducts: () => {},
    previousPage: '/',
    setPreviousPage: () => {},
    ids: undefined,
    isCanOrder: false,
    actionId: ''
}

export const AppContext = createContext<AppContextType>(defaultValueContext)

const ContextWrap = ({ children }: { children: ReactNode }) => {
    const [previousPage, setPreviousPage] = useState<string>('/')
    const [profile, setProfile] = useState<AppContextType['profile']>(defaultValueContext.profile)
    const [products, setProducts] = useState<AppContextType['products']>(defaultValueContext.products)
    const { current: actionId } = useRef<string>(uuidv7())
    const { isCanOrder } = useSocket({ actionId })

    const ids = useMemo(() => {
        if (!products.products || !Object.keys(products.products).length) {
            return undefined
        }

        const ids: {
            storeIds: string[]
            storeCheckedIds: string[]
            all: string[]
            checked: string[]
        } = Object.keys(products.products).reduce(
            (
                acum: {
                    storeIds: string[]
                    storeCheckedIds: string[]
                    all: string[]
                    checked: string[]
                },
                storeId
            ) => {
                const tmp: {
                    checked: string[]
                    storeChecked: string[]
                    all: string[]
                } = {
                    checked: [],
                    storeChecked: [],
                    all: []
                }

                products.products[storeId].forEach((product) => {
                    if (product.checked) {
                        tmp.checked.push(product.productId)
                    }
                    tmp.all.push(product.productId)
                })

                if (tmp.checked.length) {
                    tmp.storeChecked.push(storeId)
                }

                return {
                    storeIds: [...acum.storeIds, storeId],
                    storeCheckedIds: [...acum.storeCheckedIds, ...tmp.storeChecked],
                    all: [...acum.all, ...tmp.all],
                    checked: [...acum.checked, ...tmp.checked]
                }
            },
            { storeIds: [], storeCheckedIds: [], all: [], checked: [] }
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
                ids,
                isCanOrder,
                actionId
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default ContextWrap
