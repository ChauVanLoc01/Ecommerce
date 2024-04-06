import { QueryClient } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { LoaderFunction } from 'react-router-dom'
import { productFetching } from 'src/apis/product'
import { endProductDetailFetching, startProductDetailFetching } from 'src/constants/event'
import { ProductListQuery } from 'src/types/product.type'

export const productDetailLoader: LoaderFunction = async ({ params }) => {
    const queryClient = new QueryClient()
    const productId = params.productId?.split('-0-')[1]

    window.dispatchEvent(
        new CustomEvent(startProductDetailFetching, {
            detail: {
                productDetail: productId
            }
        })
    )

    const productDetail = await queryClient.fetchQuery({
        queryKey: ['productDetail', productId],
        queryFn: () => productFetching.productDetail(productId as string)
    })

    const relativedProducts = await queryClient.fetchQuery({
        queryKey: ['relativedProducts', productDetail.data.result.category],
        queryFn: () => productFetching.productList({ category: productDetail.data.result.category, sold: 'desc' })
    })

    window.dispatchEvent(
        new CustomEvent(endProductDetailFetching, {
            detail: {
                productDetail: productId
            }
        })
    )

    return [productDetail.data.result, relativedProducts.data.result]
}

export const productListLoader: LoaderFunction = async ({ request }) => {
    const queryClient = new QueryClient()
    const queryParams = new URL(request.url).searchParams as Partial<Record<keyof ProductListQuery, string>>

    const productList = await queryClient.fetchQuery({
        queryKey: ['productList'],
        queryFn: () =>
            productFetching.productList(
                omitBy(
                    {
                        ...queryParams,
                        page: Number(queryParams?.page) || undefined
                    },
                    isUndefined
                ) as ProductListQuery
            )
    })

    const categories = await queryClient.fetchQuery({
        queryKey: ['categories'],
        queryFn: () => productFetching.categoryList(),
        staleTime: Infinity,
        gcTime: Infinity
    })

    return [productList.data.result.data, categories.data.result]
}
