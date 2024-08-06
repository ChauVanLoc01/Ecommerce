import { Link } from 'react-router-dom'

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'

import { ArrowRightIcon } from '@radix-ui/react-icons'
import { Flex } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import { sale_api } from 'src/apis/sale_promotion.api'
import { channel, join_room, leave_room } from 'src/constants/event'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { CurrentSalePromotion } from 'src/types/sale.type'
import { SocketReturn } from 'src/types/socket.type'
import Countdown from './Countdown'
import ProductFlashSale from './ProductFlashSale'

type FlashSaleProps = {
    isHiddenMore?: boolean
}

const FlashSale = ({ isHiddenMore = false }: FlashSaleProps) => {
    const { currentSaleId, socket } = useContext(AppContext)
    const [productSale, setProductSale] = useState<
        Map<string, CurrentSalePromotion['result']['productPromotions'][number]>
    >(new Map())
    const { data: current_sale_promotino } = useQuery({
        queryKey: ['current-sale-promotion', currentSaleId],
        queryFn: sale_api.current_sale_promotin(currentSaleId),
        select: (data) => data.data.result,
        staleTime: Infinity,
        enabled: !!currentSaleId
    })

    useEffect(() => {
        if (current_sale_promotino?.productPromotions?.length) {
            let tmp = new Map<string, CurrentSalePromotion['result']['productPromotions'][number]>()
            current_sale_promotino.productPromotions.forEach((product) => {
                tmp?.set(product.id, product)
            })
            setProductSale(tmp)
        }
    }, [current_sale_promotino])

    useEffect(() => {
        if (currentSaleId) {
            socket?.emit(join_room, { type: channel.sale_promotion, id: currentSaleId })
            socket?.on(
                channel.sale_promotion,
                (res: SocketReturn<{ productPromotionId: string; quantity: number }>) => {
                    console.log('sale', res)
                    if (res?.action) {
                        let { result } = res
                        let updatedProductSale = productSale.get(result.productPromotionId)
                        if (updatedProductSale) {
                            setProductSale((pre) => {
                                pre.set(result.productPromotionId, { ...updatedProductSale, quantity: result.quantity })
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

    if (!productSale.size) {
        return <></>
    }

    return (
        <div className='space-y-3'>
            <Flex justify={'between'} align={'baseline'}>
                <div className='flex items-center space-x-3'>
                    <h3 className='font-semibold font-mono text-3xl bg-gradient-to-tr to-[#fcb045] via-[#fd1d1d] from-[#833ab4] bg-clip-text text-transparent'>
                        Flash Sale
                    </h3>
                    <Countdown targetTime={new Date(2024, 3, 6, 23, 59)} />
                </div>
                {!isHiddenMore && (
                    <Link
                        to={`${route.flashSale}/${current_sale_promotino?.salePromotion.id}`}
                        className='flex items-center space-x-1 text-red-500 hover:text-red-600'
                    >
                        <span>Xem thêm</span>
                        <ArrowRightIcon width={18} height={18} />
                    </Link>
                )}
            </Flex>
            <Carousel className='w-full'>
                <CarouselContent className=''>
                    {[...productSale.values()].map((product, idx) => (
                        <CarouselItem key={idx} className='basis-1/6'>
                            <ProductFlashSale product={product} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default FlashSale
