import { useContext, useMemo, useState } from 'react'

import { motion } from 'framer-motion'

import { Button, Spinner } from '@radix-ui/themes'
import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { keyBy, sumBy } from 'lodash'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { OrderFetching } from 'src/apis/order'
import { productFetching } from 'src/apis/product'
import { StoreFetching } from 'src/apis/store'
import { VoucherFetching } from 'src/apis/voucher.api'
import { AppContext } from 'src/contexts/AppContext'
import useStep from 'src/hooks/useStep'
import { ProductConvert } from 'src/types/context.type'
import { VoucherWithCondition } from 'src/types/voucher.type'
import CheckoutHeader from './CheckoutHeader'
import CheckoutSummary from './CheckoutSummary'
import CreateOrder from './CreateOrder'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const Checkout = () => {
    const { products, ids } = useContext(AppContext)
    const [addressId, setAddressId] = useState<string>('')
    const navigate = useNavigate()
    const { step, handleNextStep, handlePreviousStep } = useStep()
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false)
    const [voucherIds, setVoucherIds] = useState<{ [storeId: string]: string } | undefined>(undefined)

    if (!ids) {
        return (
            <div className='flex flex-col items-center gap-y-4'>
                <div className='w-1/4'>
                    <img
                        src='https://cdn-icons-png.flaticon.com/512/13637/13637462.png'
                        className='object-cover'
                        alt=''
                    />
                </div>
                <Button variant='soft' size={'3'} onClick={() => navigate('/')}>
                    Tiếp tục mua hàng
                </Button>
            </div>
        )
    }

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

        if (!voucherLatest || !voucherIds || !voucherIds?.length) {
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
            let isOk = true
            let categoryCondition = voucher.CategoryConditionVoucher
            let priceCondition = voucher.PriceConditionVoucher
            let remainingMaximum = voucher.maximum
            let total = 0

            Object.values(productLatest.checked[storeId]).forEach((product) => {
                total += product.priceAfter * product.buy
                if (categoryCondition && product.category !== categoryCondition.categoryShortName) {
                    isOk = false
                }
                if (priceCondition && priceCondition.priceMin && product.priceAfter < priceCondition.priceMin) {
                    isOk = false
                }
                if (isOk && remainingMaximum > 0) {
                    let productDiscount = (product.priceAfter * voucher.percent) / 100
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
            tmp.pay += summary[storeId].pay
        }, {})

        return {
            summary,
            allOrder: tmp
        }
    }, [productLatest, voucherIds])

    const {
        mutate,
        isPending,
        data: createdOrders
    } = useMutation({
        mutationFn: OrderFetching.order,
        onSuccess: () => {
            setOrderSuccess(true)
        },
        onError: () => {
            toast.error('Lỗi! Đặt hàng không thành công')
        }
    })

    const handleOrder = () => {}

    return (
        <>
            <motion.section
                initial='hidden'
                animate='visible'
                exit='hidden'
                transition={{ duration: 0.8 }}
                variants={{
                    visible: { opacity: 1 },
                    hidden: { opacity: 0 }
                }}
                className='space-y-4'
            >
                <>
                    <CheckoutHeader handlePreviousStep={handlePreviousStep} step={step} />
                    {productLatest && refreshStores ? (
                        <div className='flex gap-2'>
                            <section className='basis-2/3'>
                                {
                                    {
                                        1: (
                                            <Step1
                                                all={productLatest.all}
                                                checked={productLatest.checked}
                                                storeIds={ids.storeIds}
                                                storesLatest={refreshStores}
                                            />
                                        ),
                                        2: <Step2 addressId={addressId} setAddressId={setAddressId} />,
                                        3: <Step3 />
                                    }[step]
                                }
                            </section>
                            <CheckoutSummary
                                handleNextStep={handleNextStep}
                                handleOrder={handleOrder}
                                isPending={isPending}
                                step={step}
                                storeCheckedIds={Object.keys(productLatest?.checked)}
                                storeLatest={refreshStores}
                                productChecked={productLatest.checked}
                                priceLatest={priceLatest}
                            />
                        </div>
                    ) : (
                        <Spinner />
                    )}
                </>
            </motion.section>
            <CreateOrder data={createdOrders?.data.result || []} open={orderSuccess} setOpen={setOrderSuccess} />
        </>
    )
}

export default Checkout
