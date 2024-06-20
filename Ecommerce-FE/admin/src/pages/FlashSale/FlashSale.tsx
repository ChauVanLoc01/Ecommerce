import { useMutation, useQuery } from '@tanstack/react-query'
import { add, startOfDay } from 'date-fns'
import { Dictionary, keyBy } from 'lodash'
import { useContext, useEffect, useMemo, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { toast } from 'sonner'
import { ProductApi } from 'src/apis/product.api'
import { sale_api } from 'src/apis/sale.api'
import { AppContext } from 'src/contexts/AppContext'
import { Store } from 'src/types/auth.type'
import { ProductSaleMix, SalePromotion } from 'src/types/sale.type'
import Calendar from './CalendarEvent'
import SaleAlert from './SaleAlert'

export type ProductSelected = {
    products: Dictionary<ProductSaleMix>
    size: number
}

export type JoinedProduct = {
    products: Dictionary<ProductSaleMix>
    size: number
    checked?: number
}

const FlashSale = () => {
    const { store } = useContext(AppContext)

    const [selectedEvent, setSelectedEvent] = useState<{ open: boolean; event?: SalePromotion }>({
        open: false,
        event: undefined
    })

    const [selectedProduct, setSelectedProduct] = useState<ProductSelected>({
        products: {},
        size: 0
    })

    const [joinedProduct, setJoinedProduct] = useState<JoinedProduct>({ products: {}, size: 0 })

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

    const { mutate } = useMutation({
        mutationFn: sale_api.updateProductPromotion,
        onSuccess: () => {
            refetchSalePromotion()
            toast.success('Cập nhật thành công')
            setSelectedEvent({ open: true })
            setIsJoin(false)
        }
    })

    const onSelectEvent = (event: any) => () => setSelectedEvent({ open: true, event })

    const productTab = useMemo(
        () => [
            (productList?.dataArr || []) as ProductSaleMix[],
            Object.values(selectedProduct.products),
            Object.values(joinedProduct.products)
        ],
        [joinedProduct, selectedProduct, productList]
    )

    const handleUpdateProduct = () => {
        if (isJoin && selectedEvent?.event) {
        }
    }

    const onClear = () => {
        setSelectedProduct({ products: {}, size: 0 })
        setIsJoin(false)
        setJoinedProduct({ products: {}, size: 0 })
    }

    useEffect(() => {
        if (selectedEvent?.event) {
            let salePromotionId = selectedEvent.event.id
            setIsJoin(!!data?.storePromotionObj?.[salePromotionId])
            if (data?.storePromotionObj?.[salePromotionId]?.ProductPromotion.length) {
                setJoinedProduct({
                    products: data.storePromotionObj?.[salePromotionId].ProductPromotion.reduce((acum, product) => {
                        return {
                            ...acum,
                            [product.productId]: {
                                ...productList?.dataObj?.[product.productId],
                                quantityInSale: product.quantity,
                                priceBeforeInSale: product.priceBefore,
                                priceAfterInSale: product.priceAfter,
                                productSaleId: product.productId,
                                isChecked: true
                            }
                        }
                    }, {}),
                    size: data?.storePromotionObj[salePromotionId].ProductPromotion.length,
                    checked: data?.storePromotionObj[salePromotionId].ProductPromotion.length
                })
            }
        }
    }, [selectedEvent.open])

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
                setIsJoin={setIsJoin}
                handleUpdateProduct={handleUpdateProduct}
                isJoin={isJoin}
                onClear={onClear}
                joinedProduct={joinedProduct}
                setJoinedProduct={setJoinedProduct}
            />
        </>
    )
}

export default FlashSale
