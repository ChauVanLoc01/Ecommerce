import { Avatar, Button, Spinner, Text } from '@radix-ui/themes'
import SimpleBar from 'simplebar-react'
import { ProductConvert } from 'src/types/context.type'
import { RefreshStore } from 'src/types/store.type'
import { convertCurrentcy } from 'src/utils/utils.ts'
import Voucher from './Voucher'

type CheckoutSummaryProps = {
    isPending: boolean
    step: number
    handleNextStep: () => false | void
    handleOrder: () => void
    storeCheckedIds: string[]
    storeLatest: RefreshStore
    productChecked: ProductConvert
    priceLatest:
        | {
              summary: {
                  [storeId: string]: {
                      total: number
                      discount: number
                      pay: number
                  }
              }
              allOrder: {
                  total: number
                  discount: number
                  pay: number
              }
          }
        | undefined
}

const CheckoutSummary = ({
    handleNextStep,
    handleOrder,
    isPending,
    step,
    storeCheckedIds,
    storeLatest,
    productChecked,
    priceLatest
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
                            {Object.keys(productChecked).map((storeId) => (
                                <div className='space-y-2'>
                                    <details>
                                        <summary>
                                            <div className='inline-flex justify-between items-center w-full'>
                                                <Text>{storeLatest[storeId].name}</Text>
                                                <Text color='gray'>
                                                    Số lượng: {Object.values(productChecked[storeId]).length}
                                                </Text>
                                            </div>
                                        </summary>
                                    </details>
                                    <div className='space-y-4'>
                                        {Object.values(productChecked[storeId]).map((product) => (
                                            <div className='flex items-start justify-between' key={product.productId}>
                                                <div className='basis-2/3 flex-grow-0 space-x-3 flex items-start'>
                                                    <Avatar fallback='A' src={product.image} size={'4'} />
                                                    <Text size={'3'} className='line-clamp-2'>
                                                        {product.name}
                                                    </Text>
                                                </div>
                                                <div className='flex flex-col items-end'>
                                                    <Text color='red'>x{product.buy}</Text>
                                                    <Text size={'3'}>{convertCurrentcy(product.priceAfter)}</Text>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='p-24 space-y-4'>
                            <div className='flex justify-between'>
                                <Text weight={'bold'} size={'3'}>
                                    Tổng
                                </Text>
                                {!priceLatest ? (
                                    <Spinner />
                                ) : (
                                    <Text>{convertCurrentcy(priceLatest.allOrder.total)}</Text>
                                )}
                            </div>
                            <div className='flex justify-between'>
                                <Text weight={'bold'} size={'3'}>
                                    Giảm giá
                                </Text>
                                {!priceLatest ? (
                                    <Spinner />
                                ) : (
                                    <Text>{convertCurrentcy(priceLatest.allOrder.discount)}</Text>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='p-24 rounded-8 border border-border/30 bg-[#FFFFFF] flex justify-between'>
                        <Text weight={'bold'} size={'3'}>
                            Thanh toán
                        </Text>
                        {!priceLatest ? <Spinner /> : <Text>{convertCurrentcy(priceLatest.allOrder.pay)}</Text>}
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
