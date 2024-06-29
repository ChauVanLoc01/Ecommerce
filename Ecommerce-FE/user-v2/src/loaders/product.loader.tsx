import { isUndefined, omitBy } from 'lodash'
import { LoaderFunction } from 'react-router-dom'
import { productFetching } from 'src/apis/product'
import { sale_api } from 'src/apis/sale_promotion.api'
import { StoreFetching } from 'src/apis/store'
import { queryClient } from 'src/routes/main.route'
import { ProductListQuery } from 'src/types/product.type'
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

export const productListLoader: LoaderFunction = async ({ request }) => {
    loadingEvent.start(false)

    const queryParams = new URL(request.url).searchParams as Partial<Record<keyof ProductListQuery, string>>

    const [productList, categories] = await Promise.all([
        queryClient.fetchQuery({
            queryKey: [
                'productList',
                JSON.stringify(
                    omitBy(
                        {
                            ...queryParams,
                            page: Number(queryParams?.page) || undefined
                        },
                        isUndefined
                    ) as ProductListQuery
                )
            ],
            queryFn: () =>
                productFetching.productList(
                    omitBy(
                        {
                            ...queryParams,
                            page: Number(queryParams?.page) || undefined
                        },
                        isUndefined
                    ) as ProductListQuery
                ),
            staleTime: 1000 * 60 * 2
        }),
        queryClient.fetchQuery({
            queryKey: ['categories'],
            queryFn: () => productFetching.categoryList(),
            staleTime: Infinity
        }),
        queryClient.fetchQuery({
            queryKey: ['current-sale-promotion'],
            queryFn: sale_api.current_sale_promotin,
            staleTime: 1000 * 60 * 5
        })
    ])

    loadingEvent.end()

    return [productList.data.result, categories.data.result]
}
