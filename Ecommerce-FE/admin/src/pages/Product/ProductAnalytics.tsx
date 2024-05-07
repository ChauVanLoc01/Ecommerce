import { Flex, Kbd, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { ProductApi } from 'src/apis/product.api'

const ProductAnalytics = () => {
    const { data: analytics } = useQuery({
        queryKey: ['productAnalytic'],
        queryFn: ProductApi.productAnalytic,
        enabled: false
    })

    return (
        <Flex gapX={'6'}>
            <Flex gapX={'2'} align={'center'}>
                <Text size={'3'}>Tổng sản phẩm:</Text>
                <Kbd size={'3'} className='rounded-6 font-medium !text-green-500'>
                    {analytics?.data.result.all}
                </Kbd>
            </Flex>
            <Flex gapX={'2'} align={'center'}>
                <Text size={'3'}>Đang bán:</Text>
                <Kbd size={'3'} className='rounded-6 font-medium !text-blue'>
                    {analytics?.data.result.active}
                </Kbd>
            </Flex>
            <Flex gapX={'2'} align={'center'}>
                <Text size={'3'}>Đã xóa:</Text>
                <Kbd size={'3'} className='rounded-6 font-medium !text-red'>
                    {analytics?.data.result.block}
                </Kbd>
            </Flex>
        </Flex>
    )
}

export default ProductAnalytics
