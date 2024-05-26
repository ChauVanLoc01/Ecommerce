import { isAxiosError } from 'axios'
import { productFetching } from 'src/apis/product'
import { profileFetching } from 'src/apis/profile'
import { StoreFetching } from 'src/apis/store'
import { ErrorMessage } from 'src/constants/error'
import { queryClient } from 'src/routes/main.route'
import { ProductContext } from 'src/types/context.type'
import { ls } from 'src/utils/localStorage'

export const deliveryLoader = async () => {
    try {
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

        return [deliveries.data.result, storesExist.data.result]
    } catch (err) {
        if (isAxiosError(err)) {
            switch (err.response?.status) {
                case 401:
                    throw new Response(ErrorMessage.unauthentication, { status: 401 })
                case 400:
                    throw new Response(ErrorMessage.badrequestException, { status: 400 })
                case 404:
                    throw new Response(ErrorMessage.notfoundException, { status: 404 })
                default:
                    throw new Response(ErrorMessage.internalException, { status: 500 })
            }
        } else {
            throw new Response(ErrorMessage.unauthentication, { status: 401 })
        }
    }
}
