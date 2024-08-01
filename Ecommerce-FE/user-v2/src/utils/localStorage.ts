import localStorage from 'localstorage-slim'
import { ProductCart, ProductCartSavingToLS } from 'src/types/context.type'

export type key = 'profile' | 'products' | 'vouchers' | 'global_voucher'

export const ls = {
    setItem: (key: key, value: any) => localStorage.set(key, value),
    getItem: (key: key) => localStorage.get(key),
    deleteItem: (key: key) => localStorage.remove(key),
    clearAll: () => localStorage.clear()
}

export const setProduct = (products: ProductCart) => {
    ls.setItem('products', {
        total: products.total,
        stores: Object.keys(products.stores).reduce<any>((acum, storeId) => {
            return {
                ...acum,
                [storeId]: {
                    store_name: products.stores[storeId].store_name,
                    checked: products.stores[storeId].checked,
                    products: [...products.stores[storeId].products]
                }
            }
        }, {})
    })
}

export const getProducts = (): ProductCart => {
    let productLS = ls.getItem('products')
    if (!productLS) {
        return { total: 0, stores: {} }
    }
    let productSavingInLS = productLS as ProductCartSavingToLS
    return {
        total: productSavingInLS.total,
        stores: Object.keys(productSavingInLS.stores).reduce<ProductCart['stores']>((acum, storeId) => {
            let { checked, products, store_name } = productSavingInLS.stores[storeId]
            return {
                ...acum,
                [storeId]: {
                    checked,
                    store_name,
                    products: new Map(products)
                }
            }
        }, {})
    }
}
