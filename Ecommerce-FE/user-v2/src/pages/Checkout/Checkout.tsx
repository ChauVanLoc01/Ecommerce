import { useContext, useMemo, useState } from 'react'

import { motion } from 'framer-motion'

import { Button, Spinner } from '@radix-ui/themes'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { OrderFetching } from 'src/apis/order'
import { productFetching } from 'src/apis/product'
import { StoreFetching } from 'src/apis/store'
import { AppContext } from 'src/contexts/AppContext'
import useStep from 'src/hooks/useStep'
import { ProductConvert } from 'src/types/context.type'
import CheckoutHeader from './CheckoutHeader'
import CheckoutSummary from './CheckoutSummary'
import CreateOrder from './CreateOrder'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const Checkout = () => {
    const { products } = useContext(AppContext)
    const [addressId, setAddressId] = useState<string>('')
    const navigate = useNavigate()
    const { step, handleNextStep, handlePreviousStep } = useStep()
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false)

    const ids = useMemo(() => {
        if (!Object.keys(products.products).length) {
            return undefined
        }

        const ids: {
            storeIds: string[]
            productIds: string[]
        } = Object.keys(products.products).reduce(
            (
                acum: {
                    storeIds: string[]
                    productIds: string[]
                },
                storeId
            ) => {
                return {
                    storeIds: [...acum.storeIds, storeId],
                    productIds: [...acum.productIds, ...products.products[storeId].map((e) => e.productId)]
                }
            },
            { storeIds: [], productIds: [] }
        )

        return {
            ...ids
        }
    }, [products])

    const { data: refreshProducts } = useQuery({
        queryKey: ['refreshProduct', JSON.stringify(ids ? ids.productIds : [])],
        queryFn: () => productFetching.refreshProduct(ids ? ids.productIds : []),
        refetchInterval: 1000 * 10,
        enabled: !!ids,
        select: (data) => data.data.result,
        placeholderData: (old) => old
    })

    const { data: refreshStores } = useQuery({
        queryKey: ['refreshStore', JSON.stringify(ids ? ids.storeIds : [])],
        queryFn: () => StoreFetching.refreshStore(ids ? ids.storeIds : []),
        refetchInterval: 1000 * 10,
        select: (data) => data.data.result,
        placeholderData: (old) => old,
        enabled: !!ids
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

                return {
                    checked: { ...acum.checked, [storeId]: { ...tmp.checked } },
                    all: { ...acum.all, [storeId]: { ...tmp.all, ...tmp.checked } }
                }
            },
            { checked: {}, all: {} }
        )
    }, [refreshProducts, products])

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
