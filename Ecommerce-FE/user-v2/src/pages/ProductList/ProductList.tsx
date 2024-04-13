import loadable from '@loadable/component'
import { motion } from 'framer-motion'
import { IoSearchOutline } from 'react-icons/io5'

import Dropdown from 'src/components/Dropdown'
import InputIcon from 'src/components/InputIcon'
import Pagination from 'src/components/Pagination'

import { isUndefined, omitBy } from 'lodash'
import { useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import { productFetching } from 'src/apis/product'
import useQueryParams from 'src/hooks/useQueryParams'
import { queryClient } from 'src/routes/main.route'
import { CategoryListResponse } from 'src/types/category.type'
import { ProductListQuery, ProductListResponse } from 'src/types/product.type'
import FlashSale from './FlashSale'
import ProductCard from './ProductCard'

const Filter = loadable(() => import('./Filter'))

const ProductList = () => {
    const [queryParams] = useQueryParams<Partial<Record<keyof ProductListQuery, string>>>()

    const [productListReponse, categoryResponse] = useLoaderData() as [ProductListResponse, CategoryListResponse]

    useEffect(() => {
        queryClient.prefetchQuery({
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
                <section className='grow space-y-3 mb-10'>
                    <div className='p-[16px] bg-[#FFFFFF] rounded-12 border border-border/30 flex justify-between'>
                        <InputIcon
                            icon={<IoSearchOutline size={22} className='text-gray-400' />}
                            placeholder='Tìm kiếm sản phẩm'
                            rootClassName='basis-2/5'
                        />
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
                    <div className='space-y-8'>
                        <div className='grid grid-cols-3 gap-3'>
                            {productListReponse.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <Pagination pageSize={productListReponse.query.page_size || 10} />
                    </div>
                </section>
            </div>
        </motion.main>
    )
}

export default ProductList
