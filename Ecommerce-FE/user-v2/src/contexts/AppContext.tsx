import { useMutation, useQuery } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { ReactNode, createContext, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { productFetching } from 'src/apis/product'
import { channel, join_room, leave_room, updateProductInCart } from 'src/constants/event'
import useSocket from 'src/hooks/useSocket'
import { LoginResponse } from 'src/types/auth.type'
import { AppContext as AppContextType, Ids, ProductOrder, ProductOrderSale } from 'src/types/context.type'
import { ProductSocket, SocketReturn } from 'src/types/socket.type'
import { getProducts, ls } from 'src/utils/localStorage'
import { clearProductAfterCreatingOrder } from 'src/utils/utils.ts'
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
    const { isCanOrder, socket, currentSaleId, setCurrentSaleId } = useSocket({ actionId })

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: productFetching.categoryList,
        staleTime: Infinity,
        select: (data) => data.data.result
    })

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
            (acum, storeId, idx) => {
                let store = products.stores[storeId]
                let product_in_store = store.products
                acum.all_storeIds.push(storeId)
                acum.complexIds.push({
                    storeId,
                    productIds: []
                })
                product_in_store.forEach((product) => {
                    if (product.isChecked) {
                        acum.checked_productIds.push(product.productId)
                    }
                    acum.all_productIds.push(product.productId)
                    acum.complexIds[idx].productIds.push(product.productId)
                })
                return { ...acum }
            },
            {
                all_productIds: [],
                all_storeIds: [],
                checked_productIds: [],
                checked_storeIds: [],
                complexIds: []
            }
        )
        ids.checked_storeIds = Object.keys(products.stores).filter((storeId) => products.stores[storeId].checked)
        return cloneDeep(ids)
    }, [products])

    window.addEventListener(updateProductInCart, () => {
        setProducts((pre) => clearProductAfterCreatingOrder(ids?.checked_storeIds as string[], pre))
    })

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

    useEffect(() => {
        if (ids?.all_productIds.length && socket) {
            socket.on(channel.product, (res: SocketReturn<ProductSocket>) => {
                if (res.action) {
                    let { productId, storeId, priceAfter, quantity, name, status } = res.result
                    let isExist = products.stores?.[storeId]?.products.get(productId)
                    if (isExist) {
                        setProducts((pre) => {
                            let products = pre.stores?.[storeId]?.products
                            let productInMap = products.get(productId)
                            if (productInMap) {
                                let tmp = {
                                    ...productInMap,
                                    currentQuantity: quantity,
                                    priceAfter,
                                    name: name || productInMap.name
                                }
                                if (status && status == 'BLOCK') {
                                    tmp.isBlock = true
                                    if (productInMap.isChecked) {
                                        pre.stores[storeId].checked -= 1
                                    }
                                    tmp.isChecked = false
                                }
                                if (status && status == 'ACTIVE' && productInMap?.isBlock) {
                                    tmp.isBlock = false
                                    tmp.buy = productInMap.buy
                                }
                                products.set(productId, tmp)
                            }
                            return cloneDeep(pre)
                        })
                    }
                }
            })
            ids.all_productIds.forEach((id) => {
                socket.emit(join_room, { type: channel.product, id })
            })
        }

        return () => {
            if (socket) {
                socket.off(channel.product)
                if (ids?.all_productIds.length) {
                    ids.all_productIds.forEach((id) => {
                        socket.emit(leave_room, { type: channel.product, id })
                    })
                }
            }
        }
    }, [ids])

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
                setCurrentSaleId,
                categories
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default ContextWrap
