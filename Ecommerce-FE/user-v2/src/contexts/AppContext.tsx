import { useMutation } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { ReactNode, createContext, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { productFetching } from 'src/apis/product'
import useSocket from 'src/hooks/useSocket'
import { LoginResponse } from 'src/types/auth.type'
import { AppContext as AppContextType, Ids, ProductOrder, ProductOrderSale } from 'src/types/context.type'
import { getProducts, ls } from 'src/utils/localStorage'
import { v7 as uuidv7 } from 'uuid'

let profileLS = ls.getItem('profile')
let productLS = getProducts()

const defaultValueContext: AppContextType = {
    profile: (profileLS as LoginResponse) || undefined,
    setProfile: () => {},
    products: productLS,
    setProducts: () => {},
    previousPage: '/',
    setPreviousPage: () => {},
    ids: undefined,
    isCanOrder: false,
    actionId: '',
    socket: undefined,
    currentSaleId: '',
    setCurrentSaleId: () => null,
    setToastId: () => null,
    addToCart: () => null
}

export const AppContext = createContext<AppContextType>(defaultValueContext)

const ContextWrap = ({ children }: { children: ReactNode }) => {
    const [previousPage, setPreviousPage] = useState<string>('/')
    const [profile, setProfile] = useState<AppContextType['profile']>(defaultValueContext.profile)
    const [products, setProducts] = useState<AppContextType['products']>(defaultValueContext.products)
    const { current: actionId } = useRef<string>(uuidv7())
    const toastIdRef = useRef<string | number>()
    const { isCanOrder, socket } = useSocket({ actionId })
    const [currentSaleId, setCurrentSaleId] = useState<string>('')

    const { mutate: createViewAddToCart } = useMutation({
        mutationFn: productFetching.createViewAddToCart
    })

    const setToastId = (id: string | number) => {
        toastIdRef.current = id
    }

    const ids = useMemo(() => {
        if (!products.total) {
            return undefined
        }
        const ids = Object.keys(products.stores).reduce<Ids>(
            (acum, storeId) => {
                let store = products.stores[storeId]
                let product_in_store = store.products
                acum.all_storeIds.push(storeId)
                product_in_store.forEach((product) => {
                    if (product.isChecked) {
                        acum.checked_productIds.push(product.productId)
                    }
                    acum.all_productIds.push(product.productId)
                })
                return { ...acum }
            },
            {
                all_productIds: [],
                all_storeIds: [],
                checked_productIds: [],
                checked_storeIds: []
            }
        )
        ids.checked_storeIds = Object.keys(products.stores).filter((storeId) => products.stores[storeId].checked)
        return ids
    }, [products])

    const addToCart = (storeId: string, store_name: string, payload: ProductOrder | ProductOrderSale) => {
        setProducts((pre) => {
            let { productId, isChecked, buy } = payload
            let stores = pre.stores
            let storeExist = stores?.[storeId]
            if (!storeExist) {
                let map = new Map<string, ProductOrder>()
                map.set(productId, payload)
                pre.total += 1
                stores = {
                    ...stores,
                    [storeId]: {
                        store_name,
                        checked: isChecked ? 1 : 0,
                        products: map
                    }
                }
                return cloneDeep({ ...pre, stores })
            } else {
                if (isChecked) {
                    storeExist.checked += 1
                }
                let productMap = storeExist.products.get(productId)
                if (!productMap) {
                    pre.total += 1
                    storeExist.products.set(productId, payload)
                } else {
                    storeExist.products.set(productId, { ...productMap, ...payload, buy: productMap.buy + buy })
                }
                storeExist.store_name = store_name
                return cloneDeep({ ...pre, stores: { ...stores, [storeId]: storeExist } })
            }
        })
        toast.info('Thêm sản phẩm thành công')
        createViewAddToCart({ productId: payload.productId, quantity: payload.buy })
    }

    return (
        <AppContext.Provider
            value={{
                profile,
                setProfile,
                products,
                setProducts,
                previousPage,
                setPreviousPage,
                isCanOrder,
                actionId,
                socket,
                toastIdRef: toastIdRef.current,
                setToastId,
                addToCart,
                ids,
                currentSaleId,
                setCurrentSaleId
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default ContextWrap
