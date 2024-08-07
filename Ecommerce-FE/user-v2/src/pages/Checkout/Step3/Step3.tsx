import { Box, Flex, RadioCards, Text } from '@radix-ui/themes'
import { payment_data } from 'src/constants/payment.constants'
import { Payment } from 'src/types/payment.type'

type Step3Props = {
    payment: Payment
    setPayment: React.Dispatch<React.SetStateAction<Payment>>
}

const Step3 = ({ payment, setPayment }: Step3Props) => {
    const onPaymentChange = (value: Payment) => {
        setPayment(payment)
    }

    return (
        <div className='p-24 rounded-8 bg-white space-y-3'>
            <Text weight={'bold'} size={'4'} className='text-gray-600'>
                Chọn phương thức thanh toán
            </Text>
            <Box>
                <RadioCards.Root
                    defaultValue={payment}
                    variant='classic'
                    columns={{ initial: '4' }}
                    onValueChange={onPaymentChange}
                >
                    {payment_data.map(({ key, lable }) => (
                        <RadioCards.Item value={key}>
                            <Text>{lable}</Text>
                        </RadioCards.Item>
                    ))}
                </RadioCards.Root>
            </Box>
            <Flex justify={'end'} align={'center'} className='pt-10'>
                <Text size={'1'} className='text-gray-400'>
                    Phương thức thanh toán được cung cấp bởi VNPAY
                </Text>
            </Flex>
        </div>
    )
}

export default Step3
