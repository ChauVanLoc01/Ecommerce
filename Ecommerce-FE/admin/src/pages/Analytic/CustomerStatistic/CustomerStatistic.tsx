import { Container, Text } from '@radix-ui/themes'

const CustomerStatistic = () => {
    return (
        <Container className='bg-white p-[16px] rounded-8 border-border/20 border shadow-sm'>
            <Text weight={'medium'} size={'4'}>
                Khách Hàng
            </Text>
        </Container>
    )
}

export default CustomerStatistic
