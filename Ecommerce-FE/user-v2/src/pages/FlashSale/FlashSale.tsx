import { Button, Flex, IconButton, Select, Text, TextField } from '@radix-ui/themes'

import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { cloneDeep, debounce, DebouncedFunc } from 'lodash'
import { useContext, useEffect, useRef, useState } from 'react'
import { sale_api } from 'src/apis/sale_promotion.api'
import { PaginationNext, PaginationPrevious } from 'src/components/Shadcn/pagination'
import { channel, join_room, leave_room } from 'src/constants/event'
import { AppContext } from 'src/contexts/AppContext'
import { ProductPromotion } from 'src/types/sale.type'
import { SocketReturn } from 'src/types/socket.type'
import FlashsaleHeader from './FlashsaleHeader'
import FlashSaleProducts from './FlashSaleProducts'

const FlashSale = () => {
    const { currentSaleId, socket, categories } = useContext(AppContext)
    const [query, setQuery] = useState<{ search?: string; category?: string; page: number }>({ page: 1 })
    const [productSale, setProductSale] = useState<Map<string, ProductPromotion>>(new Map())
    const [search, setSearch] = useState<string>('')
    const searchRef = useRef<DebouncedFunc<() => void> | undefined>(undefined)

    const { data: sale_promotion_ids } = useQuery({
        queryKey: ['sale-promotion-ids'],
        queryFn: sale_api.getSalePromotionIds,
        staleTime: 1000 * 60 * 3,
        enabled: false,
        select: (data) => data.data.result
    })

    const { data: product_of_sale_promotion, refetch } = useQuery({
        queryKey: ['product-of-sale-promotion', currentSaleId],
        queryFn: sale_api.getProductOfSalePromotion(currentSaleId, query),
        staleTime: 1000 * 60 * 5,
        select: (data) => data.data.result
    })

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

    const handleNextPage = () => {
        setQuery((pre) => ({ ...pre, page: Math.min(product_of_sale_promotion?.query?.page_size || 0, pre.page + 1) }))
    }

    const handlePreviousPage = () => {
        setQuery((pre) => ({ ...pre, page: Math.max(1, pre.page - 1) }))
    }

    const handleResetFilter = () => {
        setSearch('')
        setQuery({ page: 1 })
    }

    const handleSelectCategory = (value: string) => setQuery((pre) => ({ ...pre, category: value }))

    useEffect(() => {
        if (product_of_sale_promotion?.data) {
            let tmp = new Map<string, ProductPromotion>()
            product_of_sale_promotion.data.productPromotions.forEach((product) => {
                let { id } = product
                tmp.set(id, product)
            })
            setProductSale(tmp)
        }
    }, [product_of_sale_promotion])

    useEffect(() => {
        if (currentSaleId && socket) {
            socket.emit(join_room, { type: channel.sale_promotion, id: currentSaleId })
            socket.on(
                channel.sale_promotion,
                (res: SocketReturn<{ saleId: string; productId: string; quantity: number }>) => {
                    if (res?.action) {
                        let {
                            result: { productId, quantity, saleId }
                        } = res
                        if (currentSaleId == saleId) {
                            setProductSale((pre) => {
                                let productSaleExist = pre.get(productId)
                                if (productSaleExist) {
                                    pre.set(productId, {
                                        ...productSaleExist,
                                        bought: productSaleExist.quantity - quantity
                                    })
                                }
                                return cloneDeep(pre)
                            })
                        }
                    }
                }
            )
        }
        return () => {
            socket?.emit(leave_room, { type: channel.sale_promotion, id: currentSaleId })
            socket?.off(channel.sale_promotion)
        }
    }, [currentSaleId])

    useEffect(() => {
        refetch()
    }, [query])

    useEffect(() => {
        searchRef.current = debounce(() => setQuery((pre) => ({ ...pre, search })), 1000)
        searchRef?.current()
        return () => {
            searchRef?.current?.cancel()
        }
    }, [search])

    return (
        <Flex direction={'column'} gap={'5'} className='pb-10'>
            <FlashsaleHeader salePromotions={sale_promotion_ids} />
            <Flex justify={'between'} align={'center'}>
                <Flex gapX={'4'}>
                    <TextField.Root placeholder='Tìm kiếm mã giảm giá' size='3' value={search} onChange={handleSearch}>
                        <TextField.Slot>
                            <MagnifyingGlassIcon />
                        </TextField.Slot>
                    </TextField.Root>
                    <Select.Root size='3' value={query?.category} onValueChange={handleSelectCategory}>
                        <Select.Trigger placeholder='Danh mục' />
                        <Select.Content position='popper' className='!rounded-8' align='end'>
                            {categories?.map(({ name, shortname }) => (
                                <Select.Item key={shortname} value={shortname}>
                                    {name}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                    <Button size={'3'} color='red' onClick={handleResetFilter}>
                        Xóa filter
                    </Button>
                </Flex>
                <Flex align={'baseline'} gapX={'3'}>
                    <Text size={'4'}>
                        {product_of_sale_promotion?.query.page}/{product_of_sale_promotion?.query.page_size}
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
            <FlashSaleProducts products={[...productSale.values()]} />
        </Flex>
    )
}

export default FlashSale
