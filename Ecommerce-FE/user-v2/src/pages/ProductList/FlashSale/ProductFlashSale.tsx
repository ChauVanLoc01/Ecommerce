import { Progress, Text } from '@radix-ui/themes'
import { Link } from 'react-router-dom'
import { CurrentSalePromotion } from 'src/types/sale.type'
import { convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

type ProductFlashSaleProps = {
    product: CurrentSalePromotion['result']['productPromotions'][number]
    progress_height?: number
}

const ProductFlashSale = ({
    product: { image, name, quantity, bought, priceAfter, productId },
    progress_height = 3
}: ProductFlashSaleProps) => {
    return (
        <section className='rounded-12 p-12 bg-[#FFFFFF] space-y-2'>
            <Link to={`/${removeSpecialCharacter(name)}-0-${productId}`} className='inline-block relative'>
                <img src={image} alt='T' />
            </Link>
            <div className='space-y-2'>
                <h3 className='text-red-600 text-sm font-semibold leading-5 text-center'>
                    {convertCurrentcy(priceAfter)}
                </h3>
                <div className='relative'>
                    <Progress
                        data-progress={progress_height}
                        value={(bought * 100) / quantity}
                        className='data-[progress="3"]:!h-3 data-[progress="4"]:!h-4 data-[progress="5"]:!h-5'
                        size={'3'}
                        color='orange'
                    />
                    <Text size={'1'} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                        Đã bán {bought}/{quantity}
                    </Text>
                </div>
            </div>
        </section>
    )
}

export default ProductFlashSale
