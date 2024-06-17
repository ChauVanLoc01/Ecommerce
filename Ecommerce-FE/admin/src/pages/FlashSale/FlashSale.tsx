import { useQuery } from '@tanstack/react-query'
import { add, startOfDay } from 'date-fns'
import { keyBy } from 'lodash'
import { useContext, useState } from 'react'
import { Event } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ProductApi } from 'src/apis/product.api'
import { sale_api } from 'src/apis/sale.api'
import { AppContext } from 'src/contexts/AppContext'
import { Store } from 'src/types/auth.type'
import { Product } from 'src/types/product.type'
import Calendar from './Calendar'
import SaleAlert from './SaleAlert'

const FlashSale = () => {
    const { store } = useContext(AppContext)

    const [selectedEvent, setSelectedEvent] = useState<{ open: boolean; event?: Event }>({
        open: false,
        event: undefined
    })

    const [selectedProduct, setSelectedProduct] = useState<{
        products: Record<
            string,
            Product & { quantityInSale: number; priceBeforeInSale: number; priceAfterInSale: number }
        >
        size: number
    }>({
        products: {},
        size: 0
    })

    const { data: productList } = useQuery({
        queryKey: ['productList', JSON.stringify({ limit: import.meta.env.VITE_LIMIT })],
        queryFn: () =>
            ProductApi.getAllProduct({ query: { limit: import.meta.env.VITE_LIMIT }, storeId: (store as Store).id }),
        placeholderData: (previousData) => previousData,
        select: (data) => data.data.result
    })

    const { data, refetch: refetchSalePromotion } = useQuery({
        queryKey: ['salePromotion'],
        queryFn: () => sale_api.getSalePromotion(add(startOfDay(new Date()), { hours: 7 }).toISOString()),
        select: (data) => ({
            promotions: data.data.result.promotions,
            storePromotionObj: keyBy(data.data.result.storePromotions, 'salePromotionId')
        })
    })

    const onSelectEvent = (event: any) => setSelectedEvent({ open: true, event })

    const productTab = [productList?.data || [], Object.values(selectedProduct.products)]

    return (
        <>
            <Calendar data={data} onSelectEvent={onSelectEvent} />
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
