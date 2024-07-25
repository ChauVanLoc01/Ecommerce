import loadable from '@loadable/component'
import { motion } from 'framer-motion'

import Dropdown from 'src/components/Dropdown'
import Pagination from 'src/components/Pagination'

import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { productFetching } from 'src/apis/product'
import useQueryParams from 'src/hooks/useQueryParams'
import { CategoryListResponse } from 'src/types/category.type'
import { ProductListQuery, ProductListResponse } from 'src/types/product.type'
import FlashSale from './FlashSale'
import ProductCard from './ProductCard'
import ProductSearch from './ProductSearch'

const Filter = loadable(() => import('./Filter'))

const ProductList = () => {
    const [queryParams] = useQueryParams<Partial<Record<keyof ProductListQuery, string>>>()
    const [query, setQuery] = useState<>()
    const [_, categoryResponse] = useLoaderData() as [ProductListResponse, CategoryListResponse]
    const { data, refetch } = useQuery({
        queryKey: ['productList', query],
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
        enabled: false,
        staleTime: 1000 * 60 * 2,
        placeholderData: (previousData) => previousData
    })

    useEffect(() => {
        refetch()
    }, [JSON.stringify(queryParams)])

    return (
        <motion.main
            variants={{
                open: {
                    opacity: 1
                },
                close: {
                    opacity: 0
                }
            }}
            transition={{
                duration: 0.8
            }}
            initial={'close'}
            animate={'open'}
            exit={'close'}
            className='space-y-5'
        >
            <FlashSale />
            <div className='flex gap-x-5'>
                <section className='basis-1/5 flex-shrink-0'>
                    <Filter data={categoryResponse} />
                </section>
                <section className='grow pb-10'>
                    <div className='sticky top-0 z-50 bg-[#F8F9FA]'>
                        <div className='p-[16px] z-50 bg-[#FFFFFF] rounded-12 border border-border/30 flex justify-between overflow-hidden'>
                            <ProductSearch />
                            <Dropdown
                                data={{
                                    createdAt_desc: 'Mới nhất',
                                    sold_desc: 'Bán chạy nhất',
                                    price_asc: 'Giá từ thấp đến cao',
                                    price_desc: 'Giá từ cao đến thấp'
                                }}
                                title='Sắp xếp theo ...'
                                rootClassNames='basis-1/4'
                            />
                        </div>
                        <div className='h-4 w-full z-50 bg-[#F8F9FA]' />
                    </div>

                    <div className='space-y-8'>
                        <div className='grid grid-cols-3 gap-3'>
                            {data?.data.result.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <Pagination pageSize={data?.data.result.query.page_size || 10} />
                    </div>
                </section>
            </div>
        </motion.main>
    )
}

export default ProductList
