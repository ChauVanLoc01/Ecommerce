import loadable from '@loadable/component'
import { motion } from 'framer-motion'

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Box, Flex, IconButton, Select, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { productFetching } from 'src/apis/product'
import { getSort, product_list_sort, sort_key } from 'src/constants/product.constants'
import { CategoryListResponse } from 'src/types/category.type'
import { ProductListQuery, ProductListResponse } from 'src/types/product.type'
import FlashSale from './FlashSale'
import ProductCard from './ProductCard'
import ProductSearch from './ProductSearch'

const default_query = { limit: import.meta.env.VITE_APP_LIMIT }

const Filter = loadable(() => import('./Filter'))

const ProductList = () => {
    const [query, setQuery] = useState<ProductListQuery>(default_query)
    const [_, categoryResponse] = useLoaderData() as [ProductListResponse, CategoryListResponse]
    const [page, setPage] = useState<number>(0)
    const [category, setCategory] = useState<string>()
    const [sort, setSort] = useState<string>('')

    const { data: productList, refetch } = useQuery({
        queryKey: ['productList', query],
        queryFn: () => productFetching.productList(query),
        enabled: false,
        staleTime: 1000 * 60 * 2,
        placeholderData: (old) => old,
        select: (result) => result.data.result
    })

    const handleSort = (sort: string) => {
        const { key, value } = getSort(sort)
        setSort(sort)
        setQuery((pre) => {
            Object.keys(pre).forEach((key) => {
                if (sort_key.includes(key)) {
                    delete pre[key as keyof typeof pre]
                }
            })
            return {
                ...pre,
                [key]: value
            }
        })
    }

    const handleClear = () => {
        setQuery(default_query)
        setCategory('')
        setSort('')
    }

    const handleCategory = (category: string) => {
        setCategory(category)
        setQuery((pre) => ({
            ...pre,
            category
        }))
    }

    const handlePreviousPage = () => {
        setPage((pre) => Math.max(pre - 1, 1))
        setQuery((pre) => ({
            ...pre,
            page: Math.max(page - 1, 1)
        }))
    }

    const handleNextPage = () => {
        setPage((pre) => Math.min(pre + 1, productList?.query.page_size as number))
        setQuery((pre) => ({
            ...pre,
            page: Math.min(page + 1, productList?.query.page_size as number)
        }))
    }

    useEffect(() => {
        refetch()
    }, [query])

    useEffect(() => {
        if (productList) {
            setPage(productList.query.page || 0)
        }
    }, [productList])

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
                    <Filter
                        category={category}
                        handleClear={handleClear}
                        data={categoryResponse}
                        handleCategory={handleCategory}
                    />
                </section>
                <section className='grow pb-10'>
                    <div className='sticky top-0 z-50 bg-[#F8F9FA]'>
                        <Flex
                            justify={'between'}
                            align={'center'}
                            className='p-[16px] z-50 bg-[#FFFFFF] rounded-12 border border-border/30 overflow-hidden'
                        >
                            <Flex gapX={'4'}>
                                <ProductSearch />
                                <Box width={'210px'}>
                                    <Select.Root size={'2'} value={sort} onValueChange={handleSort}>
                                        <Select.Trigger className='w-full' placeholder='Sắp xếp theo' />
                                        <Select.Content position='popper' className='rounded-6' align='end'>
                                            <Select.Group>
                                                <Select.Label>Sắp xếp theo</Select.Label>
                                                {product_list_sort.map((item) => (
                                                    <Select.Item value={item[0]}>{item[1]}</Select.Item>
                                                ))}
                                            </Select.Group>
                                        </Select.Content>
                                    </Select.Root>
                                </Box>
                            </Flex>
                            <Flex align={'baseline'} gapX={'3'}>
                                <Text size={'4'}>
                                    {page}/{productList?.query.page_size}
                                </Text>
                                <Flex gapX={'1'}>
                                    <IconButton variant='soft' color='gray' onClick={handlePreviousPage}>
                                        <ChevronLeftIcon />
                                    </IconButton>
                                    <IconButton variant='soft' color='gray' onClick={handleNextPage}>
                                        <ChevronRightIcon />
                                    </IconButton>
                                </Flex>
                            </Flex>
                        </Flex>
                        <div className='h-4 w-full z-50 bg-[#F8F9FA]' />
                    </div>
                    <div className='space-y-8'>
                        <div className='grid grid-cols-3 gap-3'>
                            {productList?.data.map((product) => <ProductCard key={product.id} product={product} />)}
                        </div>
                    </div>
                </section>
            </div>
        </motion.main>
    )
}

export default ProductList
