import { Button, Spinner, Text } from '@radix-ui/themes'
import SimpleBar from 'simplebar-react'
import { RefreshStore } from 'src/types/store.type'
import Voucher from './Voucher'

type CheckoutSummaryProps = {
    isPending: boolean
    step: number
    handleNextStep: () => false | void
    handleOrder: () => void
    storeCheckedIds: string[]
    storeLatest: RefreshStore
}

const CheckoutSummary = ({
    handleNextStep,
    handleOrder,
    isPending,
    step,
    storeCheckedIds,
    storeLatest
}: CheckoutSummaryProps) => {
    return (
        <section className='basis-1/3 space-y-4'>
            <SimpleBar style={{ maxHeight: '600px', paddingBottom: '5px' }}>
                <div className='space-y-4 pr-2'>
                    <Voucher storeCheckedIds={storeCheckedIds} storeLatest={storeLatest} />
                    <div className='rounded-8 border border-border/30 bg-[#FFFFFF]'>
                        <div className='p-24 border-b border-border-border/30'>
                            <h3 className='font-semibold'>Tổng quan đơn hàng</h3>
                        </div>
                        <div className='border-b border-border/30 p-24 space-y-4'>
                            {/* {productsChecked.map((productChecked) => (
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
                                    {convertCurrentcy(productChecked.priceAfter)}
                                </Text>
                            </div>
                        </div>
                    ))} */}
                        </div>
                        <div className='p-24 space-y-4'>
                            <div className='flex justify-between'>
                                <Text weight={'bold'} size={'3'}>
                                    Tổng
                                </Text>
                                <Text>đ</Text>
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
                        <h3 className='text-red-500 font-semibold'>đ</h3>
                    </div>
                </div>
            </SimpleBar>
            <Button onClick={step < 3 ? handleNextStep : handleOrder} size={'3'} className='!w-full'>
                {isPending && <Spinner />}
                {step === 3 ? 'Đặt hàng' : 'Tiếp tục'}
            </Button>
        </section>
    )
}

export default CheckoutSummary
