import { Flex, Kbd, Text } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Category, Product, ProductAnalyticResponse, ProductQueryAndPagination } from 'src/types/product.type'
import ProductCreate from './ProductCreate'

type ProductAnalyticsProps = {
    categories: { [key: string]: Category }
    analytics: AxiosResponse<ProductAnalyticResponse, any> | undefined
    analyticsRefetch: (
        options?: RefetchOptions
    ) => Promise<QueryObserverResult<AxiosResponse<ProductAnalyticResponse, any>, Error>>
    productListRefetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
            {
                data: Product[]
                query: Omit<ProductQueryAndPagination, 'page'> & {
                    page: number
                    page_size: number
                }
            },
            Error
        >
    >
}

const ProductAnalytics = ({ categories, analytics, analyticsRefetch, productListRefetch }: ProductAnalyticsProps) => {
    return (
        <Flex gapX={'6'}>
            <Flex gapX={'2'} align={'center'}>
                <Text size={'3'}>Tổng sản phẩm:</Text>
                <Kbd size={'3'} className='rounded-6 font-medium !text-green-500'>
                    {analytics?.data?.result?.all}
                </Kbd>
            </Flex>
            <Flex gapX={'2'} align={'center'}>
                <Text size={'3'}>Đang bán:</Text>
                <Kbd size={'3'} className='rounded-6 font-medium !text-blue'>
                    {analytics?.data?.result?.active}
                </Kbd>
            </Flex>
            <Flex gapX={'2'} align={'center'}>
                <Text size={'3'}>Đã xóa:</Text>
                <Kbd size={'3'} className='rounded-6 font-medium !text-red'>
                    {analytics?.data?.result?.block}
                </Kbd>
            </Flex>
            <ProductCreate
                categories={categories}
                analyticsRefetch={analyticsRefetch}
                productListRefetch={productListRefetch}
            />
        </Flex>
    )
}

export default ProductAnalytics
