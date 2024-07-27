import { Flex } from '@radix-ui/themes'

import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { sale_api } from 'src/apis/sale_promotion.api'
import { PaginationNext, PaginationPrevious } from 'src/components/Shadcn/pagination'
import { AppContext } from 'src/contexts/AppContext'
import FlashsaleHeader from './FlashsaleHeader'
import FlashSaleProducts from './FlashSaleProducts'

const FlashSale = () => {
    const { currentSaleId } = useContext(AppContext)
    const { data: sale_promotion_ids } = useQuery({
        queryKey: ['sale-promotion-ids'],
        queryFn: sale_api.getSalePromotionIds,
        staleTime: 1000 * 60 * 3,
        enabled: false,
        select: (data) => data.data.result
    })

    const { data: product_of_sale_promotion } = useQuery({
        queryKey: ['product-of-sale-promotion', currentSaleId],
        queryFn: sale_api.getProductOfSalePromotion(currentSaleId),
        staleTime: 1000 * 60 * 5,
        select: (data) => data.data.result
    })

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
