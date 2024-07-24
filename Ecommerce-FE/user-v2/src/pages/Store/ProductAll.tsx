import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Avatar, Button, Flex, Grid, IconButton, Select, Text, TextField } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { productFetching } from 'src/apis/product'
import { Product, ProductListQuery } from 'src/types/product.type'
import ProductCard from '../ProductList/ProductCard'

type ProductAllProps = {
    products: Product[]
}

const ProductAll = ({ products }: ProductAllProps) => {
    const param = useParams()
    const [query, setQuery] = useState<ProductListQuery>({ sold: 'desc', limit: 8 })
    const [page, setPage] = useState<number>(0)
    const [category, setCategory] = useState<string>()

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: productFetching.categoryList,
        staleTime: Infinity,
        select: (data) => data.data.result
    })

    const { data: productList, refetch: productListRefetch } = useQuery({
        queryKey: ['productsByStore', query],
        queryFn: ({ signal }) => productFetching.getAllProductByStore(param?.storeId || '', query, signal),
        staleTime: 1000 * 60 * 3,
        select: (data) => data.data.result,
        placeholderData: (data) => data
    })

    const handleClear = () => {
        setQuery({ sold: 'desc', limit: 8 })
        setCategory('')
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
        productListRefetch()
    }, [query])

    useEffect(() => {
        if (productList?.data.length) {
            setPage(productList.query.page || 0)
        } else {
            setPage(0)
        }
    }, [productList])

    return (
        <div className='space-y-5 pb-24'>
            <Flex justify={'between'} align={'center'}>
                <Flex align={'center'} gapX={'4'}>
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
                    <Select.Root size={'3'} value={category} onValueChange={handleCategory}>
                        <Select.Trigger placeholder='Chọn danh mục' />
                        <Select.Content position='popper' align='end' className='rounded-6'>
                            <Select.Group>
                                <Select.Label>Danh mục</Select.Label>
                                {categories?.map((category) => (
                                    <Select.Item value={category.shortname}>{category.name}</Select.Item>
                                ))}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                    <Select.Root size='3' defaultValue='sold_desc'>
                        <Select.Trigger placeholder='Sắp xếp' />
                        <Select.Content position='popper' className='!rounded-8'>
                            <Select.Group>
                                <Select.Label>Thời gian</Select.Label>
                                <Select.Item value='createdAt_asc'>Cũ nhất</Select.Item>
                                <Select.Item value='createdAt_desc'>Mới nhất</Select.Item>
                            </Select.Group>
                            <Select.Separator />
                            <Select.Group>
                                <Select.Label>Đã bán</Select.Label>
                                <Select.Item value='sold_desc'>Bán chạy nhất</Select.Item>
                            </Select.Group>
                            <Select.Separator />
                            <Select.Group>
                                <Select.Label>Giá bán</Select.Label>
                                <Select.Item value='price_asc'>Giá tăng dần</Select.Item>
                                <Select.Item value='price_desc'>Giá giảm dần</Select.Item>
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                    <Button size={'3'} color='red' onClick={handleClear}>
                        Xóa tất cả
                    </Button>
                </Flex>
                <Flex align={'baseline'} gapX={'3'}>
                    <Text size={'4'}>
                        {page}/{productList?.query.page_size}
                    </Text>
                    <Flex gapX={'1'}>
                        <IconButton size={'3'} variant='soft' color='gray' onClick={handlePreviousPage}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <IconButton size={'3'} variant='soft' color='gray' onClick={handleNextPage}>
                            <ChevronRightIcon />
                        </IconButton>
                    </Flex>
                </Flex>
            </Flex>
            <div>
                {productList?.data.length ? (
                    <Grid columns={'4'} gap={'5'}>
                        {productList?.data.map((product) => (
                            <ProductCard key={product.id} product={product} isHiddenStore />
                        ))}
                    </Grid>
                ) : (
                    <Flex justify={'center'} align={'center'} direction={'column'} gapY={'5'} className='py-28'>
                        <Avatar
                            fallback='product-in-store-empty'
                            src='https://cdn-icons-png.flaticon.com/512/13982/13982734.png'
                            loading='lazy'
                            className='w-28 h-28'
                        />
                        <Text size={'4'}>Không tìm thấy sản phẩm phù hợp</Text>
                    </Flex>
                )}
            </div>
        </div>
    )
}

export default ProductAll
