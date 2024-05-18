import { Flex, Kbd, Text } from '@radix-ui/themes'
import VoucherCreate from './VoucherCreate'

type VoucherAnalyticsProps = {
    all: number
    active: number
    block: number
    refetchDataAll: () => Promise<void>
}

const VoucherAnalytics = ({ active, all, block, refetchDataAll }: VoucherAnalyticsProps) => {
    return (
        <Flex gapX={'5'} align={'center'}>
            <Text>
                Tổng: <Kbd className='ml-2'>{all}</Kbd>
            </Text>
            <Text>
                Đang mở: <Kbd className='ml-2'>{active}</Kbd>
            </Text>
            <Text>
                Đã khóa: <Kbd className='ml-2'>{block}</Kbd>
            </Text>
            <VoucherCreate refetchDataAll={refetchDataAll} />
        </Flex>
    )
}

export default VoucherAnalytics
