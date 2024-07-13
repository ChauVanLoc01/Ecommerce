import { Flex } from '@radix-ui/themes'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { sale_api } from 'src/apis/sale_promotion.api'
import { PaginationNext, PaginationPrevious } from 'src/components/Shadcn/pagination'
import FlashsaleHeader from './FlashsaleHeader'
import FlashSaleProducts from './FlashSaleProducts'

const FlashSale = () => {
    const params = useParams()
    const saleIdParam = params?.['salePromotionId']
    const [saleId, setSaleId] = useState<string>(saleIdParam || '')

    const { data: sale_promotion_ids } = useQuery({
        queryKey: ['sale-promotion-ids'],
        queryFn: sale_api.getSalePromotionIds,
        staleTime: 1000 * 60 * 3,
        enabled: false,
        select: (data) => data.data.result
    })

    const { data: product_of_sale_promotion } = useQuery({
        queryKey: ['product-of-sale-promotion', saleId],
        queryFn: sale_api.getProductOfSalePromotion(saleId),
        staleTime: 1000 * 60 * 2,
        enabled: false,
        select: (data) => data.data.result
    })

    console.log('productOfPromotion', product_of_sale_promotion)

    return (
        <Flex direction={'column'} gap={'5'} className='pb-10'>
            <FlashsaleHeader salePromotions={sale_promotion_ids} />
            <FlashSaleProducts products={product_of_sale_promotion?.productPromotions} />
            <Flex justify={'end'} gapX={'3'}>
                <PaginationPrevious />
                <PaginationNext />
            </Flex>
        </Flex>
    )
}

export default FlashSale
