import { Avatar, Button, Spinner, Text } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import { OrderFetching } from 'src/apis/order'
import { AppContext } from 'src/contexts/AppContext'
import { ProductConvert } from 'src/types/context.type'
import { Payment } from 'src/types/payment.type'
import { RefreshStore } from 'src/types/store.type'
import { VoucherWithCondition } from 'src/types/voucher.type'
import { convertCurrentcy } from 'src/utils/utils.ts'
import Voucher from './Voucher'

type CheckoutSummaryProps = {
    isPending: boolean
    step: number
    handleNextStep: () => false | void
    handleOrder: () => void
    storeLatest: RefreshStore
    productChecked: ProductConvert
    refreshStores: RefreshStore
    voucherIds:
        | {
              [storeId: string]: string
          }
        | undefined
    setVoucherIds: React.Dispatch<
        React.SetStateAction<
            | {
                  [storeId: string]: string
              }
            | undefined
        >
    >
    voucherLatest:
        | {
              [x: string]: {
                  [voucherId: string]: VoucherWithCondition
              }
          }
        | undefined
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
    payment: Payment
}

const CheckoutSummary = ({
    handleNextStep,
    handleOrder,
    isPending,
    step,
    storeLatest,
    productChecked,
    priceLatest,
    refreshStores,
    voucherLatest,
    setVoucherIds,
    voucherIds,
    payment
}: CheckoutSummaryProps) => {
    const { actionId } = useContext(AppContext)
    const navigate = useNavigate()
    const { mutate: createTransaction } = useMutation({
        mutationFn: OrderFetching.createTransaction({
            bankCode: payment,
            amount: priceLatest?.allOrder.pay as number,
            actionId
        }),
        onSuccess: (result) => {
            window.location.href = result.data
        }
    })

    console.log('transaction', {
        bankCode: payment,
        amount: priceLatest?.allOrder.pay as number,
        actionId
    })

    const hanldeTransaction = () => createTransaction()

    return (
        <section className='basis-1/3 space-y-4'>
            <SimpleBar style={{ maxHeight: '600px', paddingBottom: '5px' }}>
                <div className='space-y-4 pr-2'>
                    <Voucher
                        setVoucherIds={setVoucherIds}
                        voucherIds={voucherIds}
                        refreshStores={refreshStores}
                        voucherLatest={voucherLatest}
                    />
                    <div className='rounded-8 border border-border/30 bg-[#FFFFFF]'>
                        <div className='p-24 border-b border-border-border/30'>
                            <h3 className='font-semibold'>Tổng quan đơn hàng</h3>
                        </div>
                        <div className='border-b border-border/30 p-24 space-y-4'>
                            {Object.keys(productChecked).map((storeId) => (
                                <div className='space-y-2' key={storeId}>
                                    <details>
                                        <summary className='relative'>
                                            <Text>{storeLatest?.[storeId]?.name}</Text>
                                        </summary>
                                        <div className='w-2/3 text-right ml-auto'>
                                            <div className='flex justify-between'>
                                                <Text weight={'bold'} size={'1'}>
                                                    Tổng
                                                </Text>
                                                {priceLatest && priceLatest.summary[storeId] ? (
                                                    <Text size={'1'}>
                                                        {convertCurrentcy(priceLatest.summary[storeId].total)}
                                                    </Text>
                                                ) : (
                                                    <Spinner />
                                                )}
                                            </div>
                                            <div className='flex justify-between'>
                                                <Text weight={'bold'} size={'1'}>
                                                    Giảm giá
                                                </Text>
                                                {priceLatest && priceLatest.summary[storeId] ? (
                                                    <Text size={'1'}>
                                                        -{convertCurrentcy(priceLatest.summary[storeId].discount)}
                                                    </Text>
                                                ) : (
                                                    <Spinner />
                                                )}
                                            </div>
                                            <div className='flex justify-between'>
                                                <Text weight={'bold'} size={'1'}>
                                                    Thanh toán
                                                </Text>
                                                {priceLatest && priceLatest.summary[storeId] ? (
                                                    <Text size={'1'}>
                                                        {convertCurrentcy(priceLatest.summary[storeId].pay)}
                                                    </Text>
                                                ) : (
                                                    <Spinner />
                                                )}
                                            </div>
                                        </div>
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
                                    <Text>-{convertCurrentcy(priceLatest.allOrder.discount)}</Text>
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
            <Button onClick={step < 3 ? handleNextStep : hanldeTransaction} size={'3'} className='!w-full'>
                {isPending && <Spinner />}
                {step === 3 ? 'Thanh toán' : 'Tiếp tục'}
            </Button>
        </section>
    )
}

export default CheckoutSummary
