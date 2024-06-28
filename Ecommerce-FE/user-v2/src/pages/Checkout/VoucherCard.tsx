import { ArrowBottomLeftIcon } from '@radix-ui/react-icons'
import { Badge, Flex, RadioCards, Text } from '@radix-ui/themes'
import { Store } from 'src/types/store.type'
import { VoucherWithCondition } from 'src/types/voucher.type'
import { convertCurrentcy } from 'src/utils/utils.ts'

type VoucherCardProps = {
    store: Store
    vouchers: VoucherWithCondition[]
    voucherId: string | undefined
    handleSelectVoucher: (voucherId: string) => void
    select?: string
}

const VoucherCard = ({ vouchers, voucherId, store, handleSelectVoucher, select }: VoucherCardProps) => {
    return (
        <>
            {vouchers.length > 0 && <Text>{store.name}</Text>}
            <RadioCards.Root
                size={'1'}
                columns={{ initial: '1', sm: '2' }}
                defaultValue={voucherId}
                onValueChange={(val) => val !== voucherId && handleSelectVoucher(val)}
            >
                {vouchers.map((voucher) => (
                    <RadioCards.Item key={voucher.id} value={voucher.id}>
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
                            {voucherId && voucherId === voucher.id && (
                                <Badge className='absolute top-0 right-0' size={'1'}>
                                    Đang sử dụng
                                </Badge>
                            )}
                            {select && select === voucher?.id && (
                                <Badge className='absolute top-0 right-0' color='crimson' size={'1'}>
                                    Đang chọn
                                </Badge>
                            )}
                        </Flex>
                    </RadioCards.Item>
                ))}
            </RadioCards.Root>
        </>
    )
}

export default VoucherCard
