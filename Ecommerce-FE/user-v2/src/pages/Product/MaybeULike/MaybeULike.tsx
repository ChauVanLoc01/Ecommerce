import { Text } from '@radix-ui/themes'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

import { Product } from 'src/types/product.type'
import { convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

type MaybeULikeProps = {
    product: Product
}

const MaybeULike = ({ product }: MaybeULikeProps) => {
    return (
        <section className='flex gap-4 hover:bg-[#F8F9FA] p-[24px] relative'>
            <Link to={`/${removeSpecialCharacter(product.name)}-0-${product.id}`} className='flex-shrink-0'>
                <img
                    src={product.image}
                    alt='review-img'
                    className='rounded-12 w-16 h-16 object-cover border border-border/30'
                />
            </Link>
            <div>
                {/* <Stars amount={3} /> */}
                <Link to={`/${removeSpecialCharacter(product.name)}-0-${product.id}`} className='inline-block'>
                    <Text className='line-clamp-2 pr-7 overflow-hidden'>{product.name}</Text>
                </Link>
                <div className='space-x-3 text-sm'>
                    <span className=''>{convertCurrentcy(product.priceAfter || 0, 0)}</span>
                    <span
                        className={classNames('line-through text-gray-400', {
                            hidden: !product.priceBefore
                        })}
                    >
                        {convertCurrentcy(product.priceBefore || 0, 0)}
                    </span>
                </div>
            </div>
            <button className='absolute top-[24px] right-5'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='1.5'
                    stroke='currentColor'
                    className='w-5 h-5 text-[#bfbfbf] hover:fill-red-600 hover:text-red-600'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
                    />
                </svg>
            </button>
        </section>
    )
}

export default MaybeULike
