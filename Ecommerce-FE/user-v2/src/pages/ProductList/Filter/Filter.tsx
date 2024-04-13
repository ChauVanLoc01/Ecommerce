import { yupResolver } from '@hookform/resolvers/yup'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'

import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { Label } from 'src/components/Shadcn/label'
import { RadioGroup, RadioGroupItem } from 'src/components/Shadcn/radio-group'
import useQueryParams from 'src/hooks/useQueryParams'
import { CategoryListResponse } from 'src/types/category.type'
import { ProductListQuery } from 'src/types/product.type'
import { price_schema } from 'src/utils/price.schema'

type FilterProps = {
    data: CategoryListResponse
}

const Filter = ({ data }: FilterProps) => {
    const [queryParams, setQueryParams] = useQueryParams<Partial<Record<keyof ProductListQuery, string>>>()

    const { register } = useForm({
        resolver: yupResolver(price_schema)
    })

    return (
        <section className='p-[24px] bg-[#FFFFFF] rounded-12 border border-border/30 space-y-4 sticky top-0'>
            <div className='space-y-3'>
                <h2 className='text-base font-semibold tracking-wide'>Danh mục</h2>
                <div>
                    <RadioGroup defaultValue={queryParams?.category || ''}>
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
                                <div key={category.shortname} className='flex items-center space-x-2'>
                                    <RadioGroupItem
                                        value={category.shortname}
                                        id={category.shortname}
                                        onClick={() =>
                                            setQueryParams({
                                                ...queryParams,
                                                category: category.shortname
                                            })
                                        }
                                    />
                                    <Label htmlFor={category.shortname} className='text-[15px] line-clamp-1'>
                                        {category.name}
                                    </Label>
                                </div>
                            ))}
                        </motion.div>
                    </RadioGroup>
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
                <Button
                    text='Reset'
                    className='w-full py-[10px] text-xs bg-orange-600 hover:bg-orange-700'
                    onClick={() => setQueryParams()}
                />
            </div>
        </section>
    )
}

export default Filter
