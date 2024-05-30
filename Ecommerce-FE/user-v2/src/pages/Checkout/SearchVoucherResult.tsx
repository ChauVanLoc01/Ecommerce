import { ArrowBottomLeftIcon } from '@radix-ui/react-icons'
import { Badge, CheckboxCards, Flex, Text } from '@radix-ui/themes'
import { RefreshStore } from 'src/types/store.type'
import { VoucherWithCondition } from 'src/types/voucher.type'
import { convertCurrentcy } from 'src/utils/utils.ts'

type SearchVoucherResultProps = {
    vouchers: VoucherWithCondition[]
    refreshStores: RefreshStore
}

const SearchVoucherResult = ({ vouchers, refreshStores }: SearchVoucherResultProps) => {
    return (
        <CheckboxCards.Root size={'1'} columns={{ initial: '1', sm: '2' }}>
            {vouchers.map((voucher) => (
                <CheckboxCards.Item key={voucher.id} value={voucher.id} className='relative'>
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
                    <Badge className='absolute top-2 right-2'>
                        {voucher.type === 'GLOBAL' ? 'Ecommerce' : refreshStores[voucher.storeId].name}
                    </Badge>
                </CheckboxCards.Item>
            ))}
        </CheckboxCards.Root>
    )
}

export default SearchVoucherResult
