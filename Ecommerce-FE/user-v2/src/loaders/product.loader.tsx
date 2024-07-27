import { LoaderFunction } from 'react-router-dom'
import { productFetching } from 'src/apis/product'
import { StoreFetching } from 'src/apis/store'
import { queryClient } from 'src/routes/main.route'
import { loadingEvent } from 'src/utils/utils.ts'

export const productDetailLoader: LoaderFunction = async ({ params }) => {
    loadingEvent.start(false)

    const productId = params.productId?.split('-0-')[1]

    const productDetail = await queryClient.fetchQuery({
        queryKey: ['productDetail', productId],
        queryFn: () => productFetching.productDetail(productId as string),
        staleTime: 1000 * 10,
        gcTime: 1000 * 60 * 50
    })

    const [storeDetail, relativedProducts] = await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['storeDetail', productDetail.data.result.storeId],
            queryFn: () => StoreFetching.getStoreDetail(productDetail.data.result.storeId),
            staleTime: 1000 * 60 * 5
        }),
        queryClient.fetchQuery({
            queryKey: ['relativedProducts', productDetail.data.result.category],
            queryFn: () => productFetching.productList({ category: productDetail.data.result.category, sold: 'desc' }),
            staleTime: 1000 * 60 * 2
        })
    ])

    loadingEvent.end()

    return [productDetail.data.result, relativedProducts.data.result, storeDetail.data.result]
}
