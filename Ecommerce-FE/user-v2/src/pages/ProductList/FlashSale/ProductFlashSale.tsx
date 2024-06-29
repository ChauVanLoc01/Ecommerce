import { Progress, Text } from '@radix-ui/themes'
import { Link } from 'react-router-dom'
import { CurrentSalePromotion } from 'src/types/sale.type'
import { convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

type ProductFlashSaleProps = {
    product: CurrentSalePromotion['result']['productPromotions'][number]
}

const ProductFlashSale = ({ product }: ProductFlashSaleProps) => {
    return (
        <section className='rounded-12 p-12 bg-[#FFFFFF] space-y-2'>
            <Link to={`/${removeSpecialCharacter(product.name)}-0-${product.id}`} className='inline-block relative'>
                <img src={product.image} alt='T' />
            </Link>
            <div className='space-y-2'>
                <h3 className='text-red-600 text-sm font-semibold leading-5 text-center'>
                    {convertCurrentcy(product.priceAfter)}
                </h3>
                <div className='relative'>
                    <Progress
                        value={(product.bought * 100) / product.quantity}
                        className='!h-3'
                        size={'3'}
                        color='orange'
                    />
                    <Text size={'1'} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        Đã bán {product.bought}
                    </Text>
                </div>
            </div>
        </section>
    )
}

export default ProductFlashSale
