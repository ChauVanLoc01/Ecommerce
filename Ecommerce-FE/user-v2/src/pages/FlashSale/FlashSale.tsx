import { Flex } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { addHours, format, setMilliseconds, setMinutes, setSeconds } from 'date-fns'
import { useState } from 'react'
import { productFetching } from 'src/apis/product'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'
import Timestamp from './Timestamp'

import { isUndefined, omitBy } from 'lodash'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious
} from 'src/components/Shadcn/pagination'
import useQueryParams from 'src/hooks/useQueryParams'
import { Product, ProductListQuery } from 'src/types/product.type'
import ProductCard from '../ProductList/ProductCard'
import PromotionProductCard from '../ProductList/PromotionProductCard/PromotionProductCard'

type hourEl = {
    hourNum: number
    hourText: string
    isActive: boolean
}
const currentDate = new Date()
const currentHour = currentDate.getHours()
const startDate = setMilliseconds(setSeconds(setMinutes(currentDate, 0), 0), 0)

const FlashSale = () => {
    // const currentSalePromotionId = useQuery({
    //     queryKey: ['salePromotionId'],
    //     queryFn: () => productFetching.getAllSalePromotionProduct(),
    //     enabled: false,
    //     staleTime: 1000 * 60 * 2,
    //     placeholderData: (previousData) => previousData
    // })
    const getSalePromotionsInDay = useQuery({
        queryKey: ['inDaySalesPromotionList'],
        queryFn: productFetching.getSalePromotionsInDay,
        staleTime: 1000 * 60 * 2,
        placeholderData: (previousData) => previousData
    })

    console.log('getSalePromotionsInDay', getSalePromotionsInDay)

    const [hours, setHour] = useState()

    const currentSalePromotionId = '123123'

    const salePromotionProductData = useQuery({
        queryKey: ['salesPromotionProductList'],
        queryFn: () => productFetching.getAllSalePromotionProduct(currentSalePromotionId, { limit: 2, page: 1 }),
        enabled: true,
        staleTime: 1000 * 60 * 2,
        placeholderData: (previousData) => previousData
    })

    const [queryParams] = useQueryParams<Partial<Record<keyof ProductListQuery, string>>>()
    const [page, setPage] = useState<number>(1)

    // const onChooseHour = (selectedHourNum: hourEl) => {
    //     const updatedHoursArray = hoursArray.map((hour) =>
    //         hour.hourNum === selectedHourNum.hourNum ? { ...hour, isActive: true } : { ...hour, isActive: false }
    //     )
    //     setHoursArray(updatedHoursArray)
    //     setCurrentTimeChoose(selectedHourNum)
    // }

    const getCurrentSaleInfo = useQuery({
        queryKey: ['currentSalesPromotionList'],
        queryFn: productFetching.getCurrentSaleInfo,
        staleTime: 1000 * 60 * 2,
        placeholderData: (previousData) => previousData
    })

    console.log('getCurrentSaleInfo', getCurrentSaleInfo)

    const handleClickPage = (type: 'next' | 'previous') => () => {
        setPage((pre) => (type === 'next' ? pre + 1 : pre - 1))
    }

    // console.log('productListData', productListData.data?.data.result.data)

    return (
        <Flex direction={'column'} gap={'5'}>
            <Flex className='timesales-carousels' gap={'3'} justify={'center'} items-align={'center'} width={'100%'}>
                <Carousel className='w-full'>
                    <CarouselContent>
                        {/* {getSalePromotionsInDay.data?.data.result.map((hourEl, idx) => (
                            <div
                                onClick={() => onChooseHour(hourEl)}
                                key={idx}
                                className='flex flex-row flex-wrap basis-1/5 flex-shrink-0'
                            >
                                <Timestamp
                                    hour={hourEl.hourNum}
                                    hourText={hourEl.hourText}
                                    isActive={hourEl.isActive}
                                />
                            </div>
                        ))} */}
                    </CarouselContent>
                    <CarouselPrevious type='button' />
                    <CarouselNext type='button' />
                </Carousel>
            </Flex>
            <Flex mt={'10'}>
                <div className='space-y-8'>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious onClick={handleClickPage('previous')} />
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext href='#' onClick={handleClickPage('next')} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                    <div className='grid grid-cols-4 gap-3'>
                        {getCurrentSaleInfo.data?.data.productPromotion.map((product: any, index) => (
                            <PromotionProductCard key={product?.productId} product={product} />
                        ))}
                    </div>
                </div>
            </Flex>
        </Flex>
    )
}

export default FlashSale
