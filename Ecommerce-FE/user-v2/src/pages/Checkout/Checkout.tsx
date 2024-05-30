import { useContext, useMemo, useState } from 'react'

import { motion } from 'framer-motion'

import { Button } from '@radix-ui/themes'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { OrderFetching } from 'src/apis/order'
import { productFetching } from 'src/apis/product'
import { StoreFetching } from 'src/apis/store'
import { AppContext } from 'src/contexts/AppContext'
import useStep from 'src/hooks/useStep'
import { ProductContextExtends } from 'src/types/context.type'
import CheckoutHeader from './CheckoutHeader'
import CheckoutSummary from './CheckoutSummary'
import CreateOrder from './CreateOrder'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const Checkout = () => {
    const { products, setProducts } = useContext(AppContext)
    const [addressId, setAddressId] = useState<string>('')
    const navigate = useNavigate()
    const { step, handleNextStep, handlePreviousStep, setStep } = useStep()
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false)

    const {
        ids: { productIds, storeIds }
    } = useMemo(() => {
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
            ids
        }
    }, [products])

    const { data: refreshProducts } = useQuery({
        queryKey: ['refreshProduct', JSON.stringify(productIds)],
        queryFn: () => productFetching.refreshProduct(productIds),
        refetchInterval: 1000 * 60,
        enabled: false,
        select: (data) => data.data.result
    })

    const { data: refreshStores } = useQuery({
        queryKey: ['refreshStore', JSON.stringify(storeIds)],
        queryFn: () => StoreFetching.refreshStore(storeIds),
        refetchInterval: 1000 * 60,
        enabled: false,
        select: (data) => data.data.result
    })

    const productLatest = useMemo(() => {
        return Object.keys(products.products).reduce(
            (
                acum: {
                    checked: { [storeId: string]: ProductContextExtends[] }
                    all: { [storeId: string]: ProductContextExtends[] }
                },
                storeId
            ) => {
                return {
                    checked: {
                        ...acum.checked,
                        [storeId]: products.products[storeId].reduce((subAcum: ProductContextExtends[], product) => {
                            if (product && product.checked && refreshProducts && refreshProducts[product.productId]) {
                                return [
                                    ...subAcum,
                                    {
                                        ...product,
                                        ...refreshProducts[product.productId],
                                        buy:
                                            product.buy > refreshProducts[product.productId].currentQuantity
                                                ? refreshProducts[product.productId]['currentQuantity']
                                                : product.buy
                                    }
                                ]
                            }
                            return subAcum
                        }, [])
                    },
                    all: {
                        ...acum.all,
                        [storeId]: products.products[storeId].reduce((subAcum: ProductContextExtends[], product) => {
                            if (product && refreshProducts && refreshProducts[product.productId]) {
                                return [
                                    ...subAcum,
                                    {
                                        ...product,
                                        ...refreshProducts[product.productId],
                                        buy:
                                            product.buy > refreshProducts[product.productId].currentQuantity
                                                ? refreshProducts[product.productId]['currentQuantity']
                                                : product.buy
                                    }
                                ]
                            }
                            return subAcum
                        }, [])
                    }
                }
            },
            { checked: {}, all: {} }
        )
    }, [refreshProducts])

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
                {products.length > 0 ? (
                    <>
                        <CheckoutHeader handlePreviousStep={handlePreviousStep} step={step} />
                        <div className='flex gap-2'>
                            <section className='basis-2/3'>
                                {
                                    {
                                        1: <Step1 />,
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
                            />
                        </div>
                    </>
                ) : (
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
                )}
            </motion.section>
            <CreateOrder data={createdOrders?.data.result || []} open={orderSuccess} setOpen={setOrderSuccess} />
        </>
    )
}

export default Checkout
