import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { keyBy, sumBy } from 'lodash'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { OrderFetching } from 'src/apis/order'
import { productFetching } from 'src/apis/product'
import { StoreFetching } from 'src/apis/store'
import { VoucherFetching } from 'src/apis/voucher.api'
import { ProductContext, ProductConvert } from 'src/types/context.type'
import { VoucherWithCondition } from 'src/types/voucher.type'

type UseDataCheckoutProps = {
    ids: {
        all: string[]
        checked: string[]
        storeIds: string[]
        storeCheckedIds: string[]
    }
    products: ProductContext
    voucherIds:
        | {
              [storeId: string]: string
          }
        | undefined
    setStep: React.Dispatch<React.SetStateAction<number>>
    setProducts: React.Dispatch<React.SetStateAction<ProductContext>>
}

const useDataCheckout = ({ ids, products, voucherIds, setStep, setProducts }: UseDataCheckoutProps) => {
    const { data: refreshProducts } = useQuery({
        queryKey: ['refreshProduct', JSON.stringify(ids.all)],
        queryFn: () => productFetching.refreshProduct(ids.all),
        refetchInterval: 1000 * 10,
        select: (data) => data.data.result,
        placeholderData: (old) => old
    })

    const { data: refreshStores } = useQuery({
        queryKey: ['refreshStore', JSON.stringify(ids.storeIds)],
        queryFn: () => StoreFetching.refreshStore(ids.storeIds),
        refetchInterval: 1000 * 10,
        select: (data) => data.data.result,
        placeholderData: (old) => old
    })

    const storeVouchers = useQueries({
        queries: ids.storeCheckedIds.map((storeId) => ({
            queryKey: ['storeVoucher', storeId],
            queryFn: () => VoucherFetching.getVoucherByStoreId(storeId),
            refetchInterval: 1000 * 5
        }))
    })

    const {
        mutate: orderMutate,
        isPending,
        data: orderDataMutate
    } = useMutation({
        mutationFn: OrderFetching.order,
        onSuccess: () => {
            toast.info('Đơn hàng của bạn đang được xử lý')
            if (productLatest) {
                setProducts((pre) => {
                    let tmp = pre.products
                    let length = 0
                    Object.keys(productLatest.checked).forEach((storeId) => {
                        let productCheckedArr = tmp[storeId].filter(
                            ({ productId }) => !productLatest.checked?.[storeId]?.[productId]
                        )
                        if (productCheckedArr.length) {
                            tmp = {
                                ...tmp,
                                [storeId]: productCheckedArr
                            }
                            length += productCheckedArr.length
                        } else {
                            delete tmp[storeId]
                        }
                    })
                    return {
                        length: pre.length - length,
                        products: tmp
                    }
                })
            }
            setTimeout(() => setStep(1), 1000)
        }
    })

    const productLatest = useMemo(() => {
        if (!refreshProducts || !ids) return undefined
        return ids.storeIds.reduce(
            (
                acum: {
                    checked: ProductConvert
                    all: ProductConvert
                },
                storeId
            ) => {
                let tmp = products.products[storeId].reduce(
                    (
                        subAcum: {
                            checked: ProductConvert[string]
                            all: ProductConvert[string]
                        },
                        product
                    ) => {
                        return {
                            ...subAcum,
                            [product.checked ? 'checked' : 'all']: {
                                ...subAcum[product.checked ? 'checked' : 'all'],
                                [product.productId]: {
                                    ...product,
                                    ...refreshProducts[product.productId],
                                    buy:
                                        product.buy > refreshProducts[product.productId].currentQuantity
                                            ? refreshProducts[product.productId]['currentQuantity']
                                            : product.buy
                                }
                            }
                        }
                    },
                    { checked: {}, all: {} }
                )

                if (!Object.keys(tmp.checked).length) {
                    return {
                        checked: { ...acum.checked },
                        all: { ...acum.all, [storeId]: { ...tmp.all } }
                    }
                }

                return {
                    checked: { ...acum.checked, [storeId]: { ...tmp.checked } },
                    all: { ...acum.all, [storeId]: { ...tmp.all, ...tmp.checked } }
                }
            },
            { checked: {}, all: {} }
        )
    }, [refreshProducts, products])

    const voucherLatest = useMemo(() => {
        if (!storeVouchers.length) return undefined

        const voucher = storeVouchers.reduce(
            (acum: { [storeId: string]: { [voucherId: string]: VoucherWithCondition } }, voucher, idx) => {
                if (!voucher.data) {
                    return { ...acum }
                }
                let vouchers = voucher.data.data.result
                if (!vouchers.length) {
                    return {
                        ...acum
                    }
                }
                return {
                    ...acum,
                    [ids.storeCheckedIds[idx]]: keyBy(voucher.data.data.result, 'id')
                }
            },
            {}
        )

        if (!Object.keys(voucher).length) return undefined

        return voucher
    }, [storeVouchers])

    const priceLatest = useMemo(() => {
        if (!productLatest) return undefined

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

        if (!voucherLatest || !voucherIds) {
            Object.keys(productLatest?.checked).forEach((storeId) => {
                let total = sumBy(Object.values(productLatest.checked[storeId]), (o) => o.priceAfter * o.buy)
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

            return {
                summary,
                allOrder: tmp
            }
        }

        Object.keys(voucherIds).forEach((storeId) => {
            let voucher = voucherLatest[storeId][voucherIds[storeId]]
            if (!voucher) return
            let categoryCondition = voucher.CategoryConditionVoucher
            let priceCondition = voucher.PriceConditionVoucher
            let remainingMaximum = voucher.maximum
            let total = 0

            Object.values(productLatest.checked[storeId]).forEach((product) => {
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
            summary[storeId] = {
                discount: voucher.maximum - remainingMaximum,
                pay: total - voucher.maximum,
                total
            }
            tmp.discount += summary[storeId].discount
            tmp.total += summary[storeId].total
            tmp.pay += tmp.total - tmp.discount
        }, {})

        return {
            summary,
            allOrder: tmp
        }
    }, [productLatest, voucherIds, voucherLatest])

    return {
        orderFn: {
            orderMutate,
            orderDataMutate,
            isPending
        },
        dataFromApi: {
            refreshStores
        },
        transform: {
            productLatest,
            voucherLatest,
            priceLatest
        }
    }
}

export default useDataCheckout
