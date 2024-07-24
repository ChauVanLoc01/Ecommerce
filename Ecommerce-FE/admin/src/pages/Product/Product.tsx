import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Flex, IconButton, TextField, Tooltip } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { FaRegTrashCan } from 'react-icons/fa6'
import { useLoaderData } from 'react-router-dom'
import { ProductApi } from 'src/apis/product.api'
import Pagination from 'src/components/Pagination/Pagination'
import { AppContext } from 'src/contexts/AppContext'
import { Store } from 'src/types/auth.type'
import {
    Category,
    ProductAnalyticResponse,
    ProductQueryAndPagination,
    Product as ProductType
} from 'src/types/product.type'
import LayoutProfile from '../Profile/LayoutProfile'
import ProductAnalytics from './ProductAnalytics'
import ProductDetail from './ProductDetail'
import ProductFilter from './ProductFilter'
import ProductTable from './ProductTable'
import ProductUpdate from './ProductUpdate'

const Product = () => {
    const { store } = useContext(AppContext)
    const [open, setOpen] = useState<Record<'detail' | 'update', boolean>>({ detail: false, update: false })
    const [selectedProduct, setSelectedProduct] = useState<ProductType | undefined>(undefined)
    const [query, setQuery] = useState<ProductQueryAndPagination>({ limit: import.meta.env.VITE_LIMIT })
    const [_, categories] = useLoaderData() as [ProductAnalyticResponse, { [key: string]: Category }]
    const [search, setSearch] = useState<string>('')
    const timeRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const [range, setRange] = useState<number[]>([10000, 1000000])
    const [date, setDate] = useState<DateRange | undefined>(undefined)

    const onOpen = (type: keyof typeof open, productSelected?: ProductType) => () => {
        setOpen((pre) => ({ ...pre, [type]: !pre[type] }))
        setSelectedProduct(productSelected)
    }

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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const handleClear = () => {
        setDate(undefined)
        setRange([10000, 1000000])
        setSearch('')
        setQuery({ limit: import.meta.env.VITE_LIMIT })
    }

    useEffect(() => {
        productListRefetch()
    }, [query])

    useEffect(() => {
        if (search) {
            timeRef.current = setTimeout(() => {
                setQuery((pre) => ({
                    ...pre,
                    search_key: search
                }))
            }, 500)
        }
        return () => {
            window.clearTimeout(timeRef.current)
        }
    }, [search])

    return (
        <LayoutProfile
            title='Quản lý sản phẩm'
            rightNode={
                <ProductAnalytics
                    categories={categories}
                    analytics={analytics}
                    analyticsRefetch={analyticsRefetch}
                    productListRefetch={productListRefetch}
                />
            }
        >
            <div className='bg-white rounded-8 border-border/30 space-y-4'>
                <Flex justify='between' width='100%'>
                    <Flex gapX={'4'}>
                        <TextField.Root
                            placeholder='Tìm kiếm sản phẩm...'
                            size='3'
                            onChange={handleSearch}
                            value={search}
                        >
                            <TextField.Slot>
                                <MagnifyingGlassIcon />
                            </TextField.Slot>
                        </TextField.Root>
                        <ProductFilter
                            categories={categories}
                            setQuery={setQuery}
                            date={date}
                            setDate={setDate}
                            range={range}
                            setRange={setRange}
                        />
                        <Tooltip content='Xóa filter'>
                            <IconButton color='red' size={'3'} onClick={handleClear}>
                                <FaRegTrashCan />
                            </IconButton>
                        </Tooltip>
                    </Flex>
                    <Pagination
                        pagination={{ page: data?.query.page ?? 0, page_size: data?.query.page_size ?? 0 }}
                        setQuery={setQuery}
                    />
                </Flex>
                <ProductTable
                    onOpen={onOpen}
                    data={data?.data ?? []}
                    categories={categories}
                    setSelectedProduct={setSelectedProduct}
                />
            </div>
            {selectedProduct && (
                <>
                    <ProductDetail
                        selectedProduct={selectedProduct}
                        open={open['detail']}
                        setOpenCreate={onOpen('detail')}
                    />
                    <ProductUpdate
                        selectedProduct={selectedProduct}
                        open={open['update']}
                        setOpenCreate={onOpen('update')}
                        analyticsRefetch={analyticsRefetch}
                        productListRefetch={productListRefetch}
                        categories={categories}
                    />
                </>
            )}
        </LayoutProfile>
    )
}

export default Product
