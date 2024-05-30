import { ArrowBottomLeftIcon } from '@radix-ui/react-icons'
import { CheckboxCards, Flex, Text } from '@radix-ui/themes'
import { VoucherWithCondition } from 'src/types/voucher.type'
import { convertCurrentcy } from 'src/utils/utils.ts'

type VoucherCardProps = {
    storeName: string
    vouchers: VoucherWithCondition[]
}

const VoucherCard = ({ vouchers, storeName }: VoucherCardProps) => {
    return (
        <>
            {vouchers.length > 0 && <Text>{storeName}</Text>}
            <CheckboxCards.Root size={'1'} columns={{ initial: '1', sm: '2' }}>
                {vouchers.map((voucher) => (
                    <CheckboxCards.Item key={voucher.id} value={voucher.id}>
                        <Flex direction='column' width='100%'>
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
                            <Flex mt={'2'}>
                                <Text size={'1'} color='blue'>
                                    Chi tiết
                                </Text>
                            </Flex>
                        </Flex>
                    </CheckboxCards.Item>
                ))}
            </CheckboxCards.Root>
        </>
    )
}

export default VoucherCard
