import { Container, Text } from '@radix-ui/themes'

const OrderStatistic = () => {
    return (
        <Container className='bg-white p-[16px] rounded-8 border-border/20 border shadow-sm'>
            <Text weight={'medium'} size={'4'}>
                Đơn Hàng
            </Text>
        </Container>
    )
}

export default OrderStatistic
