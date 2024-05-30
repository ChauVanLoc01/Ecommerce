import { productFetching } from 'src/apis/product'
import { profileFetching } from 'src/apis/profile'
import { StoreFetching } from 'src/apis/store'
import { queryClient } from 'src/routes/main.route'
import { ProductContext } from 'src/types/context.type'
import { ls } from 'src/utils/localStorage'
import { loadingEvent } from 'src/utils/utils.ts'

export const checkoutLoader = async () => {
    loadingEvent.start()

    const stores = (JSON.parse(ls.getItem('products') as string) as ProductContext).products
    const productsId: string[] = Object.keys(stores).reduce((acum: any, e) => {
        const storeIds = stores[e].map((i) => i.productId)
        return [...acum, ...storeIds]
    }, [])

    const [deliveries, storesExist, _] = await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['delivery'],
            queryFn: profileFetching.getDeliveries,
            staleTime: Infinity,
            gcTime: Infinity
        }),
        queryClient.fetchQuery({
            queryKey: ['refreshStore', JSON.stringify(Object.keys(stores))],
            queryFn: () => StoreFetching.refreshStore(Object.keys(stores))
        }),
        queryClient.fetchQuery({
            queryKey: ['refreshProduct', productsId],
            queryFn: () => productFetching.refreshProduct(productsId)
        })
    ])

    loadingEvent.end()

    return [deliveries.data.result, storesExist.data.result]
}
