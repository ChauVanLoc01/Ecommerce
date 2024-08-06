import { Box, Flex, Grid, Skeleton, Text } from '@radix-ui/themes'
import { CurrentSalePromotion } from 'src/types/sale.type'
import ProductFlashSale from '../ProductList/FlashSale/ProductFlashSale'

type FlashSaleProductsProps = {
    products?: CurrentSalePromotion['result']['productPromotions']
}

const FlashSaleProducts = ({ products }: FlashSaleProductsProps) => {
    console.log('products', products)

    return (
        <div>
            {products ? (
                products.length ? (
                    <Grid columns={'5'} gap={'4'}>
                        {products.map((product) => (
                            <ProductFlashSale key={product.id} product={product} progress_height={5} />
                        ))}
                    </Grid>
                ) : (
                    <Flex justify={'center'} align={'center'} className='py-24'>
                        <img
                            className='w-24 h-24 object-cover'
                            src='https://cdn-icons-png.flaticon.com/512/13982/13982857.png'
                            alt='empty_product_sale'
                        />
                    </Flex>
                )
            ) : (
                <Grid columns={'5'} gap={'5'}>
                    {Array(8)
                        .fill(0)
                        .map((_, idx) => (
                            <div className='space-y-2'>
                                <Skeleton key={`product_flash_sale_${idx}`} className='rounded-12 mb-2'>
                                    <Box height={'250px'} />
                                </Skeleton>
                                <div className='space-y-2'>
                                    <Flex justify={'center'}>
                                        <Skeleton>
                                            <Box width={'150px'} height={'25px'} />
                                        </Skeleton>
                                    </Flex>
                                    <Skeleton>
                                        <Box className='w-full h-6' />
                                    </Skeleton>
                                </div>
                            </div>
                        ))}
                </Grid>
            )}
        </div>
    )
}

export default FlashSaleProducts
