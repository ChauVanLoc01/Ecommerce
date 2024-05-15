import { Flex, TextField } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { ProductApi } from 'src/apis/product.api'
import Pagination from 'src/components/Pagination/Pagination'
import { AppContext } from 'src/contexts/AppContext'
import { Store } from 'src/types/auth.type'
import { Category, ProductAnalyticResponse, ProductQueryAndPagination } from 'src/types/product.type'
import LayoutProfile from '../Profile/LayoutProfile'
import ProductAnalytics from './ProductAnalytics'
import ProductFilter from './ProductFilter'
import ProductTable from './ProductTable'

const Product = () => {
    const { store } = useContext(AppContext)
    const [query, setQuery] = useState<ProductQueryAndPagination>({ limit: import.meta.env.VITE_LIMIT })

    const [_, categories] = useLoaderData() as [ProductAnalyticResponse, { [key: string]: Category }]

    const { refetch: productListRefetch, data } = useQuery({
        queryKey: ['productList', JSON.stringify(query)],
        queryFn: () => ProductApi.getAllProduct({ query, storeId: (store as Store).id }),
        placeholderData: (previousData) => previousData,
        select: (data) => data.data.result,
        enabled: false
    })

    const { data: analytics, refetch: analyticsRefetch } = useQuery({
        queryKey: ['productAnalytic'],
        queryFn: ProductApi.productAnalytic,
        enabled: false
    })

    useEffect(() => {
        Object.keys(query).length && productListRefetch()
    }, [query])

    return (
        <LayoutProfile
            title='Quản lý sản phẩm'
            rightNode={<ProductAnalytics categories={categories} analytics={analytics} />}
        >
            <div className='bg-white rounded-8 border-border/30 space-y-4'>
                <Flex justify='between' width='100%'>
                    <Flex gapX={'4'}>
                        <TextField.Root placeholder='Tìm kiếm sản phẩm...' size='3'>
                            <TextField.Slot>
                                <svg
                                    width='17'
                                    height='17'
                                    viewBox='0 0 15 15'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z'
                                        fill='currentColor'
                                        fill-rule='evenodd'
                                        clip-rule='evenodd'
                                    ></path>
                                </svg>
                            </TextField.Slot>
                        </TextField.Root>
                        <ProductFilter categories={categories} setQuery={setQuery} />
                    </Flex>
                    <Pagination
                        pagination={{ page: data?.query.page ?? 0, page_size: data?.query.page_size ?? 0 }}
                        setQuery={setQuery}
                    />
                </Flex>
                <ProductTable data={data?.data ?? []} categories={categories} />
            </div>
        </LayoutProfile>
    )
}

export default Product
