import { useQuery } from '@tanstack/react-query'
import { add, startOfDay } from 'date-fns'
import { keyBy } from 'lodash'
import { useContext, useEffect, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ProductApi } from 'src/apis/product.api'
import { sale_api } from 'src/apis/sale.api'
import { AppContext } from 'src/contexts/AppContext'
import { Store } from 'src/types/auth.type'
import { Product } from 'src/types/product.type'
import { SalePromotion } from 'src/types/sale.type'
import Calendar from './CalendarEvent'
import SaleAlert from './SaleAlert'

const FlashSale = () => {
    const { store } = useContext(AppContext)

    const [selectedEvent, setSelectedEvent] = useState<{ open: boolean; event?: SalePromotion }>({
        open: false,
        event: undefined
    })

    const [selectedProduct, setSelectedProduct] = useState<{
        products: Record<
            string,
            Product & { quantityInSale: number; priceBeforeInSale: number; priceAfterInSale: number; isExist: boolean }
        >
        size: number
    }>({
        products: {},
        size: 0
    })

    const [isJoin, setIsJoin] = useState<boolean>(false)

    const { data: productList } = useQuery({
        queryKey: ['productList', JSON.stringify({ limit: import.meta.env.VITE_LIMIT })],
        queryFn: () =>
            ProductApi.getAllProduct({ query: { limit: import.meta.env.VITE_LIMIT }, storeId: (store as Store).id }),
        placeholderData: (previousData) => previousData,
        select: (data) => ({
            query: data.data.result.query,
            dataArr: data.data.result.data,
            dataObj: keyBy(data.data.result.data, 'id')
        })
    })

    const { data, refetch: refetchSalePromotion } = useQuery({
        queryKey: ['salePromotion'],
        queryFn: () => sale_api.getSalePromotion(add(startOfDay(new Date()), { hours: 7 }).toISOString()),
        select: (data) => ({
            promotionObjs: keyBy(data.data.result.promotions, (e) => e.startDate),
            storePromotionObj: keyBy(data.data.result.storePromotions, 'salePromotionId')
        })
    })

    const onSelectEvent = (event: any) => () => setSelectedEvent({ open: true, event })

    const productTab = [productList?.dataArr || [], Object.values(selectedProduct.products)]

    useEffect(() => {
        if (
            selectedEvent.open &&
            selectedEvent.event?.id &&
            data?.storePromotionObj?.[selectedEvent.event.id]?.ProductPromotion?.length
        ) {
            setSelectedProduct({
                products: {
                    ...data.storePromotionObj[selectedEvent.event.id].ProductPromotion.reduce((acum, product) => {
                        return {
                            ...acum,
                            [product.productId]: {
                                ...productList?.dataObj[product.productId],
                                priceBefore: productList?.dataObj[product.productId].priceBefore,
                                priceAfter: productList?.dataObj[product.productId].priceAfter,
                                quantity: product.quantity,
                                priceBeforeInSale: product.priceBefore,
                                priceAfterInSale: product.priceAfter,
                                isExist: true
                            }
                        }
                    }, {})
                },
                size: data?.storePromotionObj[selectedEvent.event.id].ProductPromotion.length
            })
            setIsJoin(true)
        }
    }, [selectedEvent])

    return (
        <>
            <Calendar
                promotionObjs={data?.promotionObjs || {}}
                onSelectEvent={onSelectEvent}
                storePromotionObj={data?.storePromotionObj || {}}
            />
            <SaleAlert
                productTab={productTab}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                refetchSalePromotion={refetchSalePromotion}
            />
        </>
    )
}

export default FlashSale
