import { Flex, Kbd, Text } from '@radix-ui/themes'

const RatingHeader = () => {
    return (
        <Flex gapX={'5'} align={'center'}>
            <Text>
                Tổng: <Kbd className='ml-2'>100</Kbd>
            </Text>
            <Text>
                Đã phản hồi: <Kbd className='ml-2'>97</Kbd>
            </Text>
            <Text>
                Chờ phản hồi: <Kbd className='ml-2'>3</Kbd>
            </Text>
        </Flex>
    )
}

export default RatingHeader
