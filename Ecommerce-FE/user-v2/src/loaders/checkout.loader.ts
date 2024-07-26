import { AxiosResponse } from 'axios'
import { LoaderFunction } from 'react-router-dom'
import { profileFetching } from 'src/apis/profile'
import { StoreFetching } from 'src/apis/store'
import { queryClient } from 'src/routes/main.route'
import { CurrentSalePromotion } from 'src/types/sale.type'
import { getProducts, ls } from 'src/utils/localStorage'
import { loadingEvent } from 'src/utils/utils.ts'

export const checkoutLoader: LoaderFunction = async () => {
    loadingEvent.start()

    const productStringify = ls.getItem('products')

    if (!productStringify) {
        loadingEvent.end()
        return []
    }

    const current_sale_promotino = queryClient.getQueryData<AxiosResponse<CurrentSalePromotion>>([
        'current-sale-promotion'
    ])?.data?.result

    const stores = Object.keys(getProducts().stores)
    // const productsId: string[] = Object.keys(stores).reduce((acum: any, e) => {
    //     const storeIds = stores[e].map((i) => i.productId)
    //     return [...acum, ...storeIds]
    // }, [])

    const [deliveries, storesExist] = await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['delivery'],
            queryFn: profileFetching.getDeliveries,
            staleTime: Infinity,
            gcTime: Infinity
        }),
        queryClient.fetchQuery({
            queryKey: ['refreshStore', Object.keys(stores)],
            queryFn: () => StoreFetching.refreshStore(Object.keys(stores))
        })
        // queryClient.fetchQuery({
        //     queryKey: ['refreshProduct', JSON.stringify(productsId)],
        //     queryFn: productFetching.refreshProduct({ productsId, saleId: current_sale_promotino?.salePromotion.id })
        // })
    ])

    loadingEvent.end()

    return [deliveries.data.result, storesExist.data.result]
}
