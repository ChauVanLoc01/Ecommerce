import { useContext, useState } from 'react'

import { motion } from 'framer-motion'

import { Button, Spinner } from '@radix-ui/themes'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AppContext } from 'src/contexts/AppContext'
import useStep from 'src/hooks/useStep'
import { Delivery } from 'src/types/delivery.type'
import { OrderBody } from 'src/types/order.type'
import { Payment } from 'src/types/payment.type'
import CheckoutHeader from './CheckoutHeader'
import CheckoutSummary from './CheckoutSummary'
import CreateOrder from './CreateOrder'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'
import useDataCheckout from './useDataCheckout'

const CheckOutEmpty = () => {
    const navigate = useNavigate()
    return (
        <div className='flex flex-col items-center gap-y-4'>
            <div className='w-1/4'>
                <img src='https://cdn-icons-png.flaticon.com/512/13637/13637462.png' className='object-cover' alt='' />
            </div>
            <Button variant='soft' size={'3'} onClick={() => navigate('/')}>
                Tiếp tục mua hàng
            </Button>
        </div>
    )
}

const Checkout = () => {
    const { products, ids, isCanOrder, actionId, setProducts, socket } = useContext(AppContext)

    if (!ids) {
        return <CheckOutEmpty />
    }
    const [address, setAddress] = useState<Delivery | undefined>(undefined)
    const { step, handleNextStep, handlePreviousStep, setStep } = useStep()
    const [orderSuccess, setOrderSuccess] = useState<boolean>(false)
    const [voucherIds, setVoucherIds] = useState<{ [storeId: string]: string } | undefined>(undefined)
    const [payment, setPayment] = useState<Payment>('')

    const {
        dataFromApi: { refreshStores },
        orderFn: { isPending, orderDataMutate, orderMutate },
        transform: { priceLatest, productLatest, voucherLatest }
    } = useDataCheckout({ ids, products, voucherIds, setStep, setProducts, socket })

    const handleOrder = () => {
        if (!isCanOrder) {
            toast.warning('Hệ thống đang gặp lỗi!')
            return
        }

        let priceWithStore = priceLatest?.summary

        if (!priceWithStore || !productLatest) {
            toast.warning('Sản phẩm trống')
            return
        }

        let earchOfStoreId = Object.keys(priceWithStore)

        if (!earchOfStoreId) {
            toast.warning('Sản phẩm trống')
        }

        const orders: OrderBody['orders'] = earchOfStoreId.map((storeId) => {
            let { discount, pay, total } = priceWithStore[storeId]
            let productOrders = Object.values(
                productLatest?.checked[storeId] as (typeof productLatest.checked)[string]
            ).map(({ priceAfter, productId, buy }) => {
                return {
                    priceAfter: priceAfter,
                    productId,
                    quantity: buy
                }
            })
            return {
                storeId,
                total,
                discount,
                pay,
                voucherId: voucherIds?.[storeId],
                productOrders
            }
        })

        orderMutate({
            orders,
            delivery_info: {
                address: address?.address || '',
                name: address?.full_name || ''
            },
            actionId
        })
    }

    const handleRemoveVoucher = (storeId: string, isUncheckedAll: boolean) => () => {
        if (voucherIds && voucherIds[storeId] && isUncheckedAll) {
            if (Object.keys(voucherIds).length > 1) {
                setVoucherIds((pre) => {
                    pre && delete pre[storeId]
                    return pre
                })
            } else {
                setVoucherIds(undefined)
            }
        }
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
                                                handleRemoveVoucher={handleRemoveVoucher}
                                            />
                                        ),
                                        2: <Step2 address={address} setAddress={setAddress} />,
                                        3: <Step3 payment={payment} setPayment={setPayment} />
                                    }[step]
                                }
                            </section>
                            <CheckoutSummary
                                handleNextStep={handleNextStep([!!ids.checked.length, !!address][step - 1])}
                                handleOrder={handleOrder}
                                isPending={isPending}
                                step={step}
                                storeLatest={refreshStores}
                                productChecked={productLatest.checked}
                                priceLatest={priceLatest}
                                refreshStores={refreshStores}
                                voucherLatest={voucherLatest}
                                setVoucherIds={setVoucherIds}
                                voucherIds={voucherIds}
                                payment={payment}
                            />
                        </div>
                    ) : (
                        <Spinner />
                    )}
                </>
            </motion.section>
            <CreateOrder
                data={orderDataMutate?.data.result || []}
                setStep={setStep}
                open={orderSuccess}
                setOpen={setOrderSuccess}
            />
        </>
    )
}

export default Checkout
