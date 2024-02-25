import loadable from '@loadable/component'
import { IoSearchOutline } from 'react-icons/io5'

import Dropdown from 'src/components/Dropdown'
import InputIcon from 'src/components/InputIcon'
import Pagination from 'src/components/Pagination'

import ProductCard from './ProductCard'

const Filter = loadable(() => import('./Filter'))

const ProductList = () => {
    return (
        <main className='flex gap-x-5'>
            <section className='basis-1/5 flex-shrink-0'>
                <Filter />
            </section>
            <section className='grow space-y-3 mb-10'>
                <div className='p-[16px] bg-[#FFFFFF] rounded-12 border border-border/30 flex justify-between'>
                    <InputIcon
                        icon={
                            <IoSearchOutline
                                size={22}
                                className='text-gray-400'
                            />
                        }
                        placeholder='Tìm kiếm sản phẩm'
                        rootClassName='basis-2/5'
                    />
                    <Dropdown
                        data={{
                            1: 'Mới nhất',
                            2: 'Bán chạy nhất',
                            3: 'Giá từ thấp đến cao',
                            4: 'Giá từ cao đến thấp'
                        }}
                        title='Sắp xếp theo ...'
                        rootClassNames='basis-1/4'
                    />
                </div>
                <div className='space-y-8'>
                    <div className='grid grid-cols-3 gap-3'>
                        {Array(12)
                            .fill(0)
                            .map((_, idx) => (
                                <ProductCard key={idx} />
                            ))}
                    </div>
                    <Pagination pageSize={20} />
                </div>
            </section>
        </main>
    )
}

export default ProductList
