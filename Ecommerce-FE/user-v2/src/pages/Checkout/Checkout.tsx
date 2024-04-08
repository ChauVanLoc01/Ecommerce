import { useContext, useEffect, useRef, useState } from 'react'

import classNames from 'classnames'

import { motion } from 'framer-motion'
import Button from 'src/components/Button'
import Input from 'src/components/Input'

import { useLoaderData } from 'react-router-dom'
import { AppContext } from 'src/contexts/AppContext'
import { Delivery } from 'src/types/delivery.type'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

const Checkout = () => {
    const { products } = useContext(AppContext)
    const [step, setStep] = useState<number>(1)
    const [deliveries] = useLoaderData() as [Delivery[]]

    const lastStep = useRef<number>(1)

    const handleNextStep = () => step < 3 && setStep(step + 1)

    const handlePreviousStep = (ownStep: number) => () => {
        if (step > ownStep || lastStep.current >= ownStep) setStep(ownStep)
    }

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
                    <div className='flex gap-3'>
                        <section className='basis-2/3'>
                            {
                                {
                                    1: <Step1 />,
                                    2: <Step2 deliveries={deliveries} />,
                                    3: <Step3 />
                                }[step]
                            }
                        </section>
                        <section className='basis-1/3 space-y-4'>
                            <div className='p-24 rounded-8 border border-border/30 bg-[#FFFFFF] space-y-4'>
                                <h3 className='font-semibold'>Bạn có mã giảm giá?</h3>
                                <div className='flex justify-between'>
                                    <Input />
                                    <Button text='Áp dụng' className=':bg-blue-500' />
                                </div>
                            </div>
                            <div className='rounded-8 border border-border/30 bg-[#FFFFFF]'>
                                <div className='p-24 border-b border-border-border/30'>
                                    <h3 className='font-semibold'>Tổng quan đơn hàng</h3>
                                </div>
                                <div className='p-24 space-y-4'>
                                    <div className='flex justify-between'>
                                        <h3>Tổng</h3>
                                        <h3>375.000đ</h3>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h3>Mã giảm giá</h3>
                                        <h3>375.000đ</h3>
                                    </div>
                                    <div className='flex justify-between'>
                                        <h3>Vận chuyển</h3>
                                        <h3>375.000đ</h3>
                                    </div>
                                </div>
                            </div>
                            <div className='p-24 rounded-8 border border-border/30 bg-[#FFFFFF] flex justify-between'>
                                <h3 className='font-semibold'>Tổng thanh toán</h3>
                                <h3 className='text-red-500 font-semibold'>375.000đ</h3>
                            </div>
                            <Button onClick={handleNextStep} text='Tiếp tục' className='w-full' />
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
                    <Button
                        text='Tiếp tục mua sắm'
                        className='bg-white !text-blue-500 !border-blue-500 hover:!text-white'
                    />
                </div>
            )}
        </motion.section>
    )
}

export default Checkout
