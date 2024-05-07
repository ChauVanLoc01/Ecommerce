import { Progress } from '@radix-ui/themes'
import { Link } from 'react-router-dom'
import Image from 'src/components/Image'
import useLoadingProduct from 'src/hooks/useLoadingProduct'
import { Product } from 'src/types/product.type'
import { cn, convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

type ProductFlashSaleProps = {
    product: Product
}

const ProductFlashSale = ({ product }: ProductFlashSaleProps) => {
    const [isFetching] = useLoadingProduct(product.id)
    return (
        <section className='rounded-12 p-12 bg-[#FFFFFF] space-y-2'>
            <Link to={`/${removeSpecialCharacter(product.name)}-0-${product.id}`} className='inline-block relative'>
                <Image
                    src={product.image}
                    alt='product-img'
                    className='object-cover overflow-hidden rounded-8'
                    overlay={isFetching as boolean}
                    loading='lazy'
                />
                <div
                    className={cn('absolute inset-0 flex justify-center items-center', {
                        '!hidden': !isFetching
                    })}
                >
                    <div className='spinner2' />
                </div>
            </Link>
            <div className='space-y-2'>
                <h3 className='text-red-600 text-sm font-semibold leading-5 text-center'>
                    {convertCurrentcy(product.priceAfter)}
                </h3>
                <Progress value={33} size={'3'} color='orange' />
            </div>
        </section>
    )
}

export default ProductFlashSale
