import { useLoaderData } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import { ProductListResponse } from 'src/types/product.type'
import MaybeULike from './MaybeULike'

type ProductRecomendProps = {}

const ProductRecomend = ({}: ProductRecomendProps) => {
    const [, relativedProducts, _] = useLoaderData() as [any, ProductListResponse, any]
    return (
        <section className='bg-[#FFFFFF] rounded-12 border border-border/30 basis-1/2 sticky top-0'>
            <div className='border-b border-border/30 p-[24px]'>
                <h3 className='text-base font-semibold tracking-wide'>Có thể bạn sẽ thích</h3>
            </div>
            <SimpleBar style={{ maxHeight: 810 }}>
                <div className='divide-y divide-border/30'>
                    {relativedProducts.data.map((relative) => (
                        <MaybeULike key={relative.id} product={relative} />
                    ))}
                </div>
            </SimpleBar>
        </section>
    )
}

export default ProductRecomend
