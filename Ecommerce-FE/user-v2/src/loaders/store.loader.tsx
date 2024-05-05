import { LoaderFunction } from 'react-router-dom'
import { productFetching } from 'src/apis/product'
import { StoreFetching } from 'src/apis/store'
import { queryClient } from 'src/routes/main.route'

export const storeLoader: LoaderFunction = async ({ params }) => {
    const storeId = params.storeId

    const storeDetail = await queryClient.fetchQuery({
        queryKey: ['storeDetail', storeId],
        queryFn: () => StoreFetching.getStoreDetail(storeId as string),
        staleTime: 1000 * 60 * 5
    })

    const bestBuy = await queryClient.fetchQuery({
        queryKey: [
            'productsByStore',
            JSON.stringify({
                sold: 'desc'
            })
        ],
        queryFn: ({ signal }) => productFetching.getAllProductByStore(storeId as string, { sold: 'desc' }, signal),
        staleTime: 1000 * 60 * 3
    })

    return [storeDetail.data.result, bestBuy.data.result.data]
}
