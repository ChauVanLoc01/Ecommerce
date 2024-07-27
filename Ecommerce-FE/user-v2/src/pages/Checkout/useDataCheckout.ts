import { useMutation, useQuery } from '@tanstack/react-query'
import { add, endOfHour } from 'date-fns'
import { cloneDeep, sumBy } from 'lodash'
import { useContext, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { OrderFetching } from 'src/apis/order'
import { sale_api } from 'src/apis/sale_promotion.api'
import { channel, join_room, leave_room } from 'src/constants/event'
import { AppContext } from 'src/contexts/AppContext'
import { ProductSocket, SocketReturn, VoucherSocket } from 'src/types/socket.type'
import { VoucherWithCondition } from 'src/types/voucher.type'
import { clearProductAfterCreatingOrder } from 'src/utils/utils.ts'

type UseDataCheckoutProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>
}

const useDataCheckout = ({ setStep }: UseDataCheckoutProps) => {
    const { setToastId, products, setProducts, ids, socket, currentSaleId, setCurrentSaleId } = useContext(AppContext)
    const [selectedVoucher, setSelectedVoucher] = useState<Record<string, VoucherWithCondition[]> | undefined>(
        undefined
    )
    const [voucherSocket, setVoucherSocket] = useState<{
        [voucherId: string]: number
    }>({})

    const { data: current_sale_promotino } = useQuery({
        queryKey: ['current-sale-promotion'],
        queryFn: sale_api.current_sale_promotin,
        select: (data) => data.data.result,
        staleTime:
            add(endOfHour(new Date()), { hours: 7 }).getMilliseconds() - add(new Date(), { hours: 7 }).getMilliseconds()
    })

    const { data: productSaleList, refetch: productSaleRefetch } = useQuery({
        queryKey: ['product_sale_detail', ids?.checked_productIds],
        queryFn: ({ signal }) => sale_api.getProductsSaleDetail(currentSaleId, ids?.checked_productIds || [], signal),
        enabled: !!currentSaleId && !!ids?.checked_productIds,
        select: (result) => result.data.result,
        staleTime: 1000 * 60
    })

    const {
        mutate: orderMutate,
        isPending,
        data: orderDataMutate
    } = useMutation({
        mutationFn: OrderFetching.order,
        onSuccess: () => {
            let toastId = toast.loading('Đơn hàng của bạn đang được xử lý', {
                duration: Infinity
            })
            setToastId(toastId)
            setTimeout(() => {
                setProducts((pre) => clearProductAfterCreatingOrder(ids?.checked_storeIds as string[], pre))
                setStep(1)
            }, 1000)
        }
    })

    const summary = useMemo(() => {
        var tmp = {
            total: 0,
            discount: 0,
            pay: 0
        }

        var summary: {
            [storeId: string]: {
                total: number
                discount: number
                pay: number
            }
        } = {}

        Object.keys(products.stores).forEach((storeId) => {
            let cart = products.stores[storeId]
            if (!cart.checked) return
            let productsInCart = cart.products
            let total = sumBy([...productsInCart], (item) => {
                let { isChecked, priceAfter, buy } = item[1]
                if (isChecked) {
                    return priceAfter * buy
                }
                return 0
            })
            summary = {
                ...summary,
                [storeId]: {
                    total,
                    discount: 0,
                    pay: total
                }
            }
            tmp.pay += summary[storeId].pay
            tmp.total += summary[storeId].total
        })

        ids?.checked_storeIds.forEach((storeId) => {
            let vouchers = selectedVoucher?.[storeId] || []
            vouchers?.forEach((voucher) => {
                let categoryCondition = voucher.CategoryConditionVoucher
                let priceCondition = voucher.PriceConditionVoucher
                let remainingMaximum = voucher.maximum
                let total = 0

                products.stores[storeId].products.forEach((product) => {
                    let isOk = true
                    total += product.priceAfter * product.buy
                    if (categoryCondition && product.category !== categoryCondition.categoryShortName) {
                        isOk = false
                    }
                    if (priceCondition && priceCondition.priceMin && product.priceAfter < priceCondition.priceMin) {
                        isOk = false
                    }
                    if (isOk && remainingMaximum > 0) {
                        let productDiscount = (product.priceAfter * product.buy * voucher.percent) / 100
                        if (productDiscount <= remainingMaximum) {
                            remainingMaximum -= productDiscount
                        } else {
                            remainingMaximum = 0
                        }
                    }
                })
                let discount = voucher.maximum - remainingMaximum
                summary[storeId] = {
                    discount,
                    pay: total - discount,
                    total
                }
                tmp.discount += discount
                tmp.pay += summary[storeId].total - tmp.discount
            })
        }, {})

        return {
            overview: tmp,
            detail: summary
        }
    }, [products, selectedVoucher])

    useEffect(() => {
        if (ids?.checked_productIds.length && socket) {
            socket.on(channel.product, (res: SocketReturn<ProductSocket>) => {
                if (res.action) {
                    let { productId, storeId, priceAfter, quantity } = res.result
                    let isExist = products.stores?.[storeId]?.products.get(productId)
                    if (isExist) {
                        setProducts((pre) => {
                            let products = pre.stores?.[storeId]?.products
                            let productInMap = products.get(productId)
                            if (productInMap) {
                                products.set(productId, {
                                    ...productInMap,
                                    currentQuantity: quantity,
                                    priceAfter
                                })
                            }
                            return cloneDeep(pre)
                        })
                    }
                }
            })
            ids.checked_productIds.forEach((id) => {
                socket.emit(join_room, { type: channel.product, id })
            })
        }

        return () => {
            if (socket) {
                socket.off(channel.product)
                if (ids?.checked_productIds.length) {
                    ids.checked_productIds.forEach((id) => {
                        socket.emit(leave_room, { type: channel.product, id })
                    })
                }
            }
        }
    }, [ids])

    useEffect(() => {
        if (socket && selectedVoucher && Object.values(selectedVoucher).length) {
            socket.on(channel.voucher, (res: SocketReturn<VoucherSocket>) => {
                if (res.action) {
                    let { voucherId, quantity } = res.result
                    setVoucherSocket((pre) => ({
                        ...pre,
                        [voucherId]: quantity
                    }))
                }
            })
            Object.values(selectedVoucher).forEach((id) => {
                socket.emit(join_room, { type: channel.voucher, id })
            })
        }

        return () => {
            if (socket && selectedVoucher) {
                socket.off(channel.voucher)
                Object.values(selectedVoucher).forEach((id) => {
                    socket.emit(leave_room, { type: channel.voucher, id })
                })
            }
        }
    }, [selectedVoucher])

    useEffect(() => {
        if (currentSaleId) {
            productSaleRefetch()
        }
    }, [ids?.checked_productIds])

    useEffect(() => {
        if (current_sale_promotino) {
            setCurrentSaleId(current_sale_promotino?.salePromotion?.id || '')
        }
    }, [current_sale_promotino])

    // useEffect(() => {
    //     if (productSaleList) {
    //         setProducts((pre) => {
    //             Object.keys(productSaleList).forEach((storeId) => {
    //                 let store = pre.stores?.[storeId]
    //                 if (store) {
    //                     productSaleList[storeId].forEach((product) => {
    //                         let { productId, ...rest } = product
    //                         let productInMap = store.products.get(productId)
    //                         if (productInMap) {
    //                             store.products.set(productId, {
    //                                 ...productInMap,
    //                                 ...rest,
    //                                 buy: Math.min(rest.currentQuantity, productInMap.buy)
    //                             })
    //                         }
    //                     })
    //                 }
    //             })
    //             return cloneDeep(pre)
    //         })
    //     }
    // }, [productSaleList])

    return {
        orderFn: {
            orderMutate,
            orderDataMutate,
            isPending
        },
        summary,
        selectedVoucher,
        setSelectedVoucher
    }
}

export default useDataCheckout
