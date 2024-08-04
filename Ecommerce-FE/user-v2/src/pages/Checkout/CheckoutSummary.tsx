import { Avatar, Badge, Button, Flex, Spinner, Text } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import SimpleBar from 'simplebar-react'
import { OrderFetching } from 'src/apis/order'
import { AppContext } from 'src/contexts/AppContext'
import { Payment } from 'src/types/payment.type'
import { Voucher as VoucherType } from 'src/types/voucher.type'
import { ls } from 'src/utils/localStorage'
import { convertCurrentcy, isProductSale } from 'src/utils/utils.ts'
import Voucher from './Voucher'

type CheckoutSummaryProps = {
    isPending: boolean
    step: number
    handleNextStep: () => void
    handleOrder: () => void
    payment: Payment
    selectedVoucher?: Record<string, VoucherType[]>
    setSelectedVoucher: React.Dispatch<React.SetStateAction<Record<string, VoucherType[]> | undefined>>
    summary: {
        overview: {
            total: number
            discount: number
            pay: number
        }
        detail: {
            [storeId: string]: {
                total: number
                discount: number
                pay: number
            }
        }
    }
}

const CheckoutSummary = ({
    handleNextStep,
    isPending,
    step,
    payment,
    handleOrder,
    setSelectedVoucher,
    summary,
    selectedVoucher
}: CheckoutSummaryProps) => {
    const { products, ids } = useContext(AppContext)

    const { mutate: createTransaction } = useMutation({
        mutationFn: OrderFetching.createTransaction({
            bankCode: payment,
            amount: summary.overview.pay
        }),
        onSuccess: (result) => {
            window.location.href = result.data
        }
    })

    const handleCheckTransaction = () => {
        if (payment === 'cash') {
            handleOrder()
        } else {
            hanldeTransaction()
        }
    }

    const hanldeTransaction = () => {
        let tmp: { [storeId: string]: string[] } = {}
        Object.keys(selectedVoucher || {}).map((storeId) => {
            tmp = {
                ...tmp,
                [storeId]: []
            }
            selectedVoucher?.[storeId]?.forEach((voucher) => {
                tmp[storeId].push(voucher.id)
            })
        })
        ls.setItem('vouchers', tmp)
        createTransaction()
    }

    return (
        <section className='basis-1/3 space-y-4'>
            <SimpleBar style={{ maxHeight: '600px', paddingBottom: '5px' }}>
                <div className='space-y-4 pr-2'>
                    <Voucher setSelectedVoucher={setSelectedVoucher} selectedVoucher={selectedVoucher} />
                    <div className='rounded-8 border border-border/30 bg-[#FFFFFF]'>
                        <div className='p-24 border-b border-border-border/30'>
                            <h3 className='font-semibold'>Tổng quan đơn hàng</h3>
                        </div>
                        <div className='border-b border-border/30 p-24 space-y-4'>
                            {Object.keys(products.stores).length &&
                                Object.keys(products.stores)
                                    .filter((storeId) => products.stores[storeId].checked)
                                    .map((storeId) => {
                                        let productInCart = [...products.stores[storeId].products]
                                            .filter(([_, e]) => e.isChecked)
                                            .map(([_, product]) => (
                                                <div
                                                    className='flex items-start justify-between'
                                                    key={product.productId}
                                                >
                                                    <div className='basis-2/3 flex-grow-0 space-x-3 flex items-start'>
                                                        <Avatar fallback='A' src={product.image} size={'4'} />
                                                        <Text size={'3'} className='line-clamp-2'>
                                                            {product.name}
                                                        </Text>
                                                    </div>
                                                    <div className='flex flex-col items-end'>
                                                        <Text color='red'>x{product.buy}</Text>
                                                        <Text size={'3'}>
                                                            {convertCurrentcy(
                                                                isProductSale(product)
                                                                    ? product.sale.priceAfter
                                                                    : product.priceAfter
                                                            )}
                                                        </Text>
                                                    </div>
                                                </div>
                                            ))
                                        return (
                                            <div className='space-y-2' key={`summary_${storeId}`}>
                                                <details>
                                                    <summary className='relative'>
                                                        <Text>{products.stores?.[storeId]?.store_name}</Text>
                                                    </summary>
                                                    <div className='w-2/3 text-right ml-auto'>
                                                        <div className='flex justify-between'>
                                                            <Text weight={'bold'} size={'1'}>
                                                                Tổng
                                                            </Text>
                                                            {
                                                                <Text size={'1'}>
                                                                    {convertCurrentcy(
                                                                        summary.detail?.[storeId]?.total || 0
                                                                    )}
                                                                </Text>
                                                            }
                                                        </div>
                                                        <div className='flex justify-between'>
                                                            <Text weight={'bold'} size={'1'}>
                                                                Giảm giá
                                                            </Text>
                                                            {
                                                                <Text size={'1'}>
                                                                    {convertCurrentcy(
                                                                        summary.detail?.[storeId]?.discount || 0
                                                                    )}
                                                                </Text>
                                                            }
                                                        </div>
                                                        <div className='flex justify-between'>
                                                            <Text weight={'bold'} size={'1'}>
                                                                Thanh toán
                                                            </Text>
                                                            {
                                                                <Text size={'1'}>
                                                                    {convertCurrentcy(
                                                                        summary?.detail?.[storeId]?.pay || 0
                                                                    )}
                                                                </Text>
                                                            }
                                                        </div>
                                                    </div>
                                                </details>
                                                <div className='space-y-4'>{productInCart}</div>
                                            </div>
                                        )
                                    })}
                            {!ids?.checked_productIds.length && (
                                <Flex justify={'center'} align={'center'}>
                                    <Avatar
                                        className='size-16'
                                        fallback='checkout_summary'
                                        src='https://cdn-icons-png.flaticon.com/512/11696/11696700.png'
                                    />
                                </Flex>
                            )}
                        </div>
                        {!!ids?.checked_productIds.length && (
                            <div className='p-24 space-y-4'>
                                <Flex justify={'between'} align={'center'}>
                                    <Text weight={'bold'} size={'3'}>
                                        Tổng
                                    </Text>
                                    <Badge size={'3'} color='gray'>
                                        {convertCurrentcy(summary.overview.total)}
                                    </Badge>
                                </Flex>
                                <Flex justify={'between'} align={'center'}>
                                    <Text weight={'bold'} size={'3'}>
                                        Giảm giá
                                    </Text>
                                    <Badge size={'3'} color='red'>
                                        {convertCurrentcy(summary.overview.discount) || 0}
                                    </Badge>
                                </Flex>
                            </div>
                        )}
                    </div>
                    {!!ids?.checked_storeIds.length && (
                        <div className='p-24 rounded-8 border border-border/30 bg-[#FFFFFF] flex justify-between items-center'>
                            <Text weight={'bold'} size={'3'}>
                                Thanh toán
                            </Text>
                            <Badge size={'3'} color='blue' className='font-bold'>
                                {convertCurrentcy(summary.overview.pay) || 0}
                            </Badge>
                        </div>
                    )}
                </div>
            </SimpleBar>
            <Button onClick={step < 3 ? handleNextStep : handleCheckTransaction} size={'3'} className='!w-full'>
                {isPending && <Spinner />}
                {step === 3 ? 'Thanh toán' : 'Tiếp tục'}
            </Button>
        </section>
    )
}

export default CheckoutSummary
