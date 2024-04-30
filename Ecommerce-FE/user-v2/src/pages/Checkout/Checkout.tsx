import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import classNames from 'classnames'

import { motion } from 'framer-motion'

import { Avatar, Button, Spinner, Text, TextField } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import { toast } from 'sonner'
import { OrderFetching } from 'src/apis/order'
import { AppContext } from 'src/contexts/AppContext'
import { ls } from 'src/utils/localStorage'
import { convertCurrentcy } from 'src/utils/utils.ts'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const Checkout = () => {
    const { products, setProducts } = useContext(AppContext)
    const [step, setStep] = useState<number>(1)
    const [addressId, setAddressId] = useState<string>('')
    const navigate = useNavigate()

    const { mutate, isPending } = useMutation({
        mutationFn: OrderFetching.order,
        onSuccess: () => {
            toast.success('Đặt hàng thành công')
            setTimeout(() => {
                var length = 0
                var productWithoutChecked = Object.keys(products.products).reduce((acum: any, storeId) => {
                    const tmp = products.products[storeId].filter((e) => !e.checked)
                    if (tmp.length > 0) {
                        length += tmp.length
                        return {
                            ...acum,
                            [storeId]: tmp
                        }
                    }
                    return acum
                }, {})
                var newProductInLS = {
                    ...products,
                    length,
                    products: productWithoutChecked
                }
                setProducts(newProductInLS)
                ls.deleteItem('products')
                ls.setItem('products', JSON.stringify(newProductInLS))
                navigate('/profile/order')
            }, 1000)
        },
        onError: () => {
            toast.error('Lỗi! Đặt hàng không thành công')
        }
    })

    const lastStep = useRef<number>(1)

    const handleOrder = () => {
        const ordersParameter: {
            storeId: string
            orders: {
                productId: string
                price_after: string
                quantity: number
            }[]
        }[] = Object.keys(products.products).reduce((acum: any, storeId) => {
            const productReadyOrder = products.products[storeId]
                .filter((product) => product.checked)
                .map((e) => {
                    return {
                        productId: e.productId,
                        price_after: e.priceAfter,
                        quantity: e.buy
                    }
                })
            if (productReadyOrder.length > 0) {
                return [
                    ...acum,
                    {
                        storeId: storeId,
                        orders: productReadyOrder
                    }
                ]
            }
            return acum
        }, [])

        if (ordersParameter.length === 0) {
            toast.error('Đơn đặt hàng không được rỗng')
            setStep(1)
            return
        }

        mutate({
            orderParameters: ordersParameter as any,
            deliveryInformationId: addressId
        })
    }

    const handleNextStep = () => step < 3 && setStep(step + 1)

    const handlePreviousStep = (ownStep: number) => () => {
        if (step > ownStep || lastStep.current >= ownStep) setStep(ownStep)
    }

    const productsChecked = useMemo(
        () =>
            Object.values(products.products).reduce((acum, item) => {
                return [...acum, ...item.filter((inner) => inner.checked)]
            }, []),
        [products]
    )

    useEffect(() => {
        if (step > lastStep.current) lastStep.current = step
    }, [step])

    return (
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
                    <div className='flex rounded-8 border border-border/30 items-center bg-[#FFFFFF]'>
                        <button
                            onClick={handlePreviousStep(1)}
                            className={classNames('pl-5 pr-28 py-5 space-x-2', {
                                'text-blue-600': step == 1
                            })}
                        >
                            <span
                                className={classNames('px-2 py-1 rounded-full border border-border/40', {
                                    'text-white bg-blue-600 border-blue-600': step == 1
                                })}
                            >
                                1
                            </span>
                            <span>Giỏ hàng</span>
                        </button>
                        <button
                            onClick={handlePreviousStep(2)}
                            className={classNames('pl-5 pr-28 py-5 space-x-2', {
                                'text-blue-600': step == 2
                            })}
                        >
                            <span
                                className={classNames('px-2 py-1 rounded-full border border-border/40', {
                                    'text-white bg-blue-600 border-blue-600': step == 2
                                })}
                            >
                                2
                            </span>
                            <span>Thông tin vận chuyển</span>
                        </button>
                        <button
                            onClick={handlePreviousStep(3)}
                            className={classNames('pl-5 pr-28 py-5 space-x-2', {
                                'text-blue-600': step == 3
                            })}
                        >
                            <span
                                className={classNames('px-2 py-1 rounded-full border border-border/40', {
                                    'text-white bg-blue-600 border-blue-600': step == 3
                                })}
                            >
                                3
                            </span>
                            <span>Thanh toán</span>
                        </button>
                    </div>
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
                        <section className='basis-1/3 space-y-4'>
                            <SimpleBar style={{ maxHeight: '600px', paddingBottom: '5px' }}>
                                <div className='space-y-4 pr-2'>
                                    <div className='p-24 rounded-8 border border-border/30 bg-[#FFFFFF] space-y-4'>
                                        <h3 className='font-semibold'>Bạn có mã giảm giá?</h3>
                                        <div className='flex justify-between items-center gap-x-2'>
                                            <TextField.Root
                                                className='flex-grow'
                                                placeholder='Nhập mã giảm giá'
                                                size={'3'}
                                            />
                                            <Button size={'3'}>Áp dụng</Button>
                                        </div>
                                    </div>
                                    <div className='rounded-8 border border-border/30 bg-[#FFFFFF]'>
                                        <div className='p-24 border-b border-border-border/30'>
                                            <h3 className='font-semibold'>Tổng quan đơn hàng</h3>
                                        </div>
                                        <div className='border-b border-border/30 p-24 space-y-4'>
                                            {productsChecked.map((productChecked) => (
                                                <div
                                                    className='flex items-start justify-between'
                                                    key={productChecked.productId}
                                                >
                                                    <div className='basis-2/3 flex-grow-0 space-x-3 flex items-start'>
                                                        <Avatar fallback='A' src={productChecked.image} size={'4'} />
                                                        <Text size={'3'} className='line-clamp-2'>
                                                            {productChecked.name}
                                                        </Text>
                                                    </div>
                                                    <div className='flex flex-col items-end'>
                                                        <Text color='red'>x{productChecked.buy}</Text>
                                                        <Text size={'3'}>
                                                            {convertCurrentcy(productChecked.priceAfter)}đ
                                                        </Text>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='p-24 space-y-4'>
                                            <div className='flex justify-between'>
                                                <Text weight={'bold'} size={'3'}>
                                                    Tổng
                                                </Text>
                                                <Text>
                                                    {convertCurrentcy(
                                                        productsChecked.reduce((acu, item) => {
                                                            return acu + item.priceAfter * item.buy
                                                        }, 0)
                                                    )}
                                                    đ
                                                </Text>
                                            </div>
                                            <div className='flex justify-between'>
                                                <Text weight={'bold'} size={'3'}>
                                                    Mã giảm giá
                                                </Text>
                                                <Text>0đ</Text>
                                            </div>
                                            <div className='flex justify-between'>
                                                <Text weight={'bold'} size={'3'}>
                                                    Vận chuyển
                                                </Text>
                                                <Text>0đ</Text>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='p-24 rounded-8 border border-border/30 bg-[#FFFFFF] flex justify-between'>
                                        <h3 className='font-semibold'>Tổng thanh toán</h3>
                                        <h3 className='text-red-500 font-semibold'>
                                            {convertCurrentcy(
                                                productsChecked.reduce((acu, item) => {
                                                    return acu + item.priceAfter * item.buy
                                                }, 0)
                                            )}
                                            đ
                                        </h3>
                                    </div>
                                </div>
                            </SimpleBar>
                            <Button onClick={step < 3 ? handleNextStep : handleOrder} size={'3'} className='!w-full'>
                                {isPending && <Spinner />}
                                {step === 3 ? 'Đặt hàng' : 'Tiếp tục'}
                            </Button>
                        </section>
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
                    <Button className='bg-white !text-blue-500 !border-blue-500 hover:!text-white'>Tiếp tục</Button>
                </div>
            )}
        </motion.section>
    )
}

export default Checkout
