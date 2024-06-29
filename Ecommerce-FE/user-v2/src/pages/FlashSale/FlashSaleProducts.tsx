import { Grid, Spinner } from '@radix-ui/themes'
import ProductFlashSale from '../ProductList/FlashSale/ProductFlashSale'
import { CurrentSalePromotion } from 'src/types/sale.type'

type FlashSaleProductsProps = {
    products?: CurrentSalePromotion['result']['productPromotions']
}

const FlashSaleProducts = ({ products }: FlashSaleProductsProps) => {
    return (
        <Grid columns={'4'} gap={'4'}>
            {products ? (
                products.map((product) => <ProductFlashSale key={product.id} product={product} progress_height={4} />)
            ) : (
                <div className='flex-grow flex-shrink-0'>
                    <Spinner />
                </div>
            )}
        </Grid>
    )
}

export default FlashSaleProducts
