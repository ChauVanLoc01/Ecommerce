import { ArrowBottomLeftIcon } from '@radix-ui/react-icons'
import { Avatar, Badge, Flex, RadioCards, Text } from '@radix-ui/themes'
import { useContext } from 'react'
import { voucher_type } from 'src/constants/voucher.constant'
import { AppContext } from 'src/contexts/AppContext'
import { Voucher, VoucherWithCondition } from 'src/types/voucher.type'
import { convertCurrentcy } from 'src/utils/utils.ts'

type VoucherCardProps = {
    storeId: string
    vouchers: VoucherWithCondition[]
    handleSelectVoucher: (storeId: string, voucherId: string) => void
    select: Record<string, Voucher>
    selectedVoucher?: Record<string, Voucher[]>
}

const VoucherCard = ({ vouchers, storeId, handleSelectVoucher, select, selectedVoucher }: VoucherCardProps) => {
    const { products } = useContext(AppContext)
    const store_name = storeId === 'system' ? 'Mã giảm giá của hệ thống' : products.stores[storeId].store_name
    console.log('vouchers', vouchers)
    return (
        <>
            {vouchers.length > 0 && (
                <Text color='gray' size={'3'}>
                    {store_name}
                </Text>
            )}
            <RadioCards.Root
                size={'1'}
                columns={{ initial: '1', sm: '2' }}
                defaultValue={selectedVoucher?.[storeId]?.find((voucher) => voucher.type === voucher_type.ACTIVE)?.id}
                onValueChange={(voucherId) => handleSelectVoucher(storeId, voucherId)}
            >
                {vouchers.length ? (
                    vouchers.map((voucher) => (
                        <RadioCards.Item
                            key={voucher.id}
                            value={voucher.id}
                            disabled={
                                !voucher.currentQuantity ||
                                !!selectedVoucher?.[storeId]?.find((voucher) => voucher?.id === voucher.id)
                            }
                        >
                            <Flex direction='column' width='100%' className='relative'>
                                <Text weight='bold' size={'3'}>
                                    {voucher.title}
                                </Text>
                                <Flex gapX={'2'}>
                                    <Flex align={'center'}>
                                        <ArrowBottomLeftIcon />
                                        <Text size={'1'}>{voucher.percent}%</Text>
                                    </Flex>
                                    <Text size={'1'}>Tối đa {convertCurrentcy(voucher.maximum)}</Text>
                                </Flex>
                                <Flex mt={'2'} justify={'between'} align={'center'}>
                                    <Flex align={'center'} gapX={'1'}>
                                        <Text>Số lượng:</Text>
                                        <Text color='yellow'>{voucher.currentQuantity}</Text>
                                    </Flex>
                                    <Text size={'1'} color='blue'>
                                        Chi tiết
                                    </Text>
                                </Flex>
                                {selectedVoucher?.[storeId]?.find((e) => e.id === voucher.id) && (
                                    <Badge className='absolute top-0 right-0' size={'1'}>
                                        Đang sử dụng
                                    </Badge>
                                )}
                                {select?.[storeId] && (
                                    <Badge className='absolute top-0 right-0' color='red' size={'1'}>
                                        Đang chọn
                                    </Badge>
                                )}
                            </Flex>
                        </RadioCards.Item>
                    ))
                ) : (
                    <Flex justify={'center'} align={'center'}>
                        <Avatar
                            className='w-16 h-16'
                            fallback='empty_voucher'
                            src='https://cdn-icons-png.flaticon.com/512/11696/11696700.png'
                        />
                    </Flex>
                )}
            </RadioCards.Root>
        </>
    )
}

export default VoucherCard
