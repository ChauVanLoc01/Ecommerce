import Button from 'src/components/Button'
import Checkbox from 'src/components/Checkbox'
import Input from 'src/components/Input'

const Filter = () => {
    return (
        <section className='p-[24px] bg-[#FFFFFF] rounded-12 border border-border/30 space-y-4 sticky top-0'>
            <div className='space-y-3'>
                <h2 className='text-base font-semibold tracking-wide'>
                    Danh mục
                </h2>
                <div className='space-y-2'>
                    {Array(10)
                        .fill(0)
                        .map((_, idx) => (
                            <Checkbox
                                key={idx}
                                text='Smart phone'
                                htmlFor={String(idx)}
                            />
                        ))}
                </div>
            </div>
            <div className='space-y-1'>
                <h2 className='text-base font-semibold tracking-wide'>Giá</h2>
                <div className='flex items-center gap-4'>
                    <Input
                        lable='Min'
                        className='px-2 py-[8px]'
                        lableClassName='mb-1'
                    />
                    <Input
                        lable='Max'
                        className='px-2 py-[8px]'
                        lableClassName='mb-1'
                    />
                </div>
            </div>
            <div className='space-y-3'>
                <Button
                    text='Reset'
                    className='w-full py-[10px] text-xs bg-orange-600 hover:bg-orange-700'
                />
                <Button text='Áp dụng' className='w-full py-[10px] text-xs' />
            </div>
        </section>
    )
}

export default Filter
