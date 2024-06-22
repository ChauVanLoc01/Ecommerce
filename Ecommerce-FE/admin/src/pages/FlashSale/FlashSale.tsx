import { useMutation, useQuery } from '@tanstack/react-query'
import { add, startOfDay } from 'date-fns'
import { Dictionary, keyBy } from 'lodash'
import { useContext, useMemo, useState } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { toast } from 'sonner'
import { ProductApi } from 'src/apis/product.api'
import { sale_api } from 'src/apis/sale.api'
import { AppContext } from 'src/contexts/AppContext'
import { Store } from 'src/types/auth.type'
import { ProductSaleMix, SalePromotion, UpdateProductSaleBody } from 'src/types/sale.type'
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

    const [tab, setTab] = useState<number>(0)

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

    const { mutate: updateProductSale } = useMutation({
        mutationFn: sale_api.updateProductPromotion,
        onSuccess: () => {
            refetchSalePromotion()
            toast.success('Cập nhật thành công')
            setSelectedEvent({ open: false })
            onClear()
        },
        onError: () => {
            toast.error('Lôi! Cập nhật không thành công')
        }
    })

    const onSelectEvent = (event: SalePromotion) => () => {
        setSelectedEvent({ open: true, event })
        let salePromotionId = event.id
        let productSale = data?.storePromotionObj?.[salePromotionId]
        setIsJoin(!!productSale)
        if (productSale?.ProductPromotion.length) {
            setJoinedProduct({
                products: productSale?.ProductPromotion.reduce((acum, product) => {
                    return {
                        ...acum,
                        [product.productId]: {
                            ...productList?.dataObj?.[product.productId],
                            quantityInSale: product.quantity,
                            priceBeforeInSale: product.priceBefore,
                            priceAfterInSale: product.priceAfter,
                            productSaleId: product.id,
                            isChecked: true
                        }
                    }
                }, {}),
                size: productSale?.ProductPromotion.length,
                checked: productSale?.ProductPromotion.length
            })
        }
    }

    const productTab = useMemo(() => {
        if (tab === 1) {
            return Object.values(selectedProduct.products)
        } else if (tab === 2) {
            return Object.values(joinedProduct.products)
        }
        return (productList?.dataArr || []).filter((e) => !joinedProduct.products?.[e.id]) as ProductSaleMix[]
    }, [productList, tab, joinedProduct, selectedProduct])

    const handleUpdateProduct = () => {
        updateProductSale({
            productPromotions: Object.keys(joinedProduct.products).map((key) => {
                let { isChecked, priceAfterInSale, quantityInSale, productSaleId } = joinedProduct.products[key]
                return {
                    productPromotionId: productSaleId,
                    isDelete: !isChecked,
                    priceAfter: priceAfterInSale,
                    quantity: quantityInSale
                }
            }) as UpdateProductSaleBody['productPromotions']
        })
    }

    const onClear = () => {
        setSelectedProduct({ products: {}, size: 0 })
        setIsJoin(false)
        setJoinedProduct({ products: {}, size: 0 })
        setTab(0)
    }

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
                handleUpdateProduct={handleUpdateProduct}
                isJoin={isJoin}
                onClear={onClear}
                joinedProduct={joinedProduct}
                setJoinedProduct={setJoinedProduct}
                setTab={setTab}
                tab={tab}
                storePromotionObj={data?.storePromotionObj || {}}
            />
        </>
    )
}

export default FlashSale
