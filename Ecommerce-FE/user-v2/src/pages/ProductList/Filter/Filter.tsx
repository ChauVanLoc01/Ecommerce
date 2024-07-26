import { yupResolver } from '@hookform/resolvers/yup'
import { Button, RadioGroup } from '@radix-ui/themes'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'

import Input from 'src/components/Input'
import { CategoryListResponse } from 'src/types/category.type'
import { price_schema } from 'src/utils/price.schema'

type FilterProps = {
    data: CategoryListResponse
    category: string | undefined
    handleCategory: (category: string) => void
    handleClear: () => void
}

const Filter = ({ data, handleCategory, handleClear, category }: FilterProps) => {
    const { register } = useForm({
        resolver: yupResolver(price_schema)
    })

    return (
        <section className='p-[24px] bg-[#FFFFFF] rounded-12 border border-border/30 space-y-4 sticky top-0'>
            <div className='space-y-3'>
                <h2 className='text-base font-semibold tracking-wide'>Danh mục</h2>
                <div>
                    <RadioGroup.Root value={category} onValueChange={handleCategory}>
                        <motion.div
                            className='space-y-2'
                            initial='hidden'
                            whileInView='visible'
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            variants={{
                                visible: { opacity: 1 },
                                hidden: { opacity: 0 }
                            }}
                        >
                            {data.map((category) => (
                                <RadioGroup.Item
                                    key={`filter_${category.name}`}
                                    value={category.shortname}
                                    id={category.shortname}
                                    className='space-x-2 line-clamp-1'
                                >
                                    {category.name}
                                </RadioGroup.Item>
                            ))}
                        </motion.div>
                    </RadioGroup.Root>
                </div>
            </div>
            <div className='space-y-1'>
                <h2 className='text-base font-semibold tracking-wide'>Giá</h2>
                <div className='flex items-center gap-4'>
                    <Input
                        lable='Min'
                        className='px-2 py-[8px]'
                        lableClassName='mb-1'
                        register={register('price_min')}
                    />
                    <Input
                        lable='Max'
                        className='px-2 py-[8px]'
                        lableClassName='mb-1'
                        register={register('price_max')}
                    />
                </div>
            </div>
            <div className='space-y-3'>
                <Button color='red' className='w-full' onClick={handleClear}>
                    Đặt lại
                </Button>
            </div>
        </section>
    )
}

export default Filter
