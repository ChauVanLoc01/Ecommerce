import { useContext, useEffect, useState } from 'react'

import { motion } from 'framer-motion'

import { Button } from '@radix-ui/themes'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AppContext } from 'src/contexts/AppContext'
import useStep from 'src/hooks/useStep'
import { Delivery } from 'src/types/delivery.type'
import { OrderBody } from 'src/types/order.type'
import { Payment } from 'src/types/payment.type'
import { ls } from 'src/utils/localStorage'
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
    const [payment, setPayment] = useState<Payment>('VNBANK')
    const [searchParams, _] = useSearchParams()
    const navigate = useNavigate()
    let vnp_Params = Object.fromEntries(searchParams)
    const isOpen = vnp_Params?.['status']

    const {
        orderFn: { isPending, orderDataMutate, orderMutate },
        summary,
        selectedVoucher,
        setSelectedVoucher
    } = useDataCheckout({ setStep })

    console.log('selectedVoucher', selectedVoucher)

    const handleOrder = () => {
        if (!isCanOrder) {
            toast.warning('Hệ thống đang gặp lỗi!')
            return
        }
        let vouchers = ls.getItem('vouchers') as Record<string, string[]>
        const orders: OrderBody['orders'] = ids.checked_storeIds.map((storeId) => {
            let { discount, pay, total } = summary.detail[storeId]
            let productOrders = [...products.stores[storeId].products].map<
                OrderBody['orders'][number]['productOrders'][number]
            >(([_, { priceAfter, buy, productId }]) => {
                return {
                    priceAfter,
                    productId,
                    quantity: buy
                }
            })
            console.log(
                'selectedVoucher?.[storeId]?.map((voucher) => voucher.id)',
                selectedVoucher?.[storeId]?.map((voucher) => voucher.id)
            )
            return {
                storeId,
                total,
                discount,
                pay,
                voucherIds: vouchers?.[storeId] || [],
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
        // if (voucherIds && voucherIds[storeId] && isUncheckedAll) {
        //     if (Object.keys(voucherIds).length > 1) {
        //         setVoucherIds((pre) => {
        //             pre && delete pre[storeId]
        //             return pre
        //         })
        //     } else {
        //         setVoucherIds(undefined)
        //     }
        // }
    }

    useEffect(() => {
        if (isOpen) {
            toast.success('Thanh toán thành công')
            navigate({
                pathname: window.location.pathname,
                search: ''
            })
            setTimeout(() => {
                handleOrder()
            }, 800)
        }
    }, [])

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
                    <div className='flex gap-2'>
                        <section className='basis-2/3'>
                            {
                                {
                                    1: <Step1 handleRemoveVoucher={handleRemoveVoucher} />,
                                    2: <Step2 address={address} setAddress={setAddress} />,
                                    3: <Step3 payment={payment} setPayment={setPayment} />
                                }[step]
                            }
                        </section>
                        <CheckoutSummary
                            handleNextStep={handleNextStep}
                            handleOrder={handleOrder}
                            isPending={isPending}
                            step={step}
                            payment={payment}
                            selectedVoucher={selectedVoucher}
                            setSelectedVoucher={setSelectedVoucher}
                            summary={summary}
                        />
                    </div>
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
