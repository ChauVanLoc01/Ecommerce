import Button from 'src/components/Button'
import Input from 'src/components/Input'

import { useState } from 'react'
import { Delivery } from 'src/types/delivery.type'
import AddressItem from './AddressItem'

type Step2Props = {
    deliveries: Delivery[]
}

const Step2 = ({ deliveries }: Step2Props) => {
    const [checked, setChecked] = useState<string>(deliveries.find((delivery) => delivery.isPrimary)?.id as string)
    return (
        <section className='p-24 rounded-8 border border-border/30 bg-[#FFFFFF] space-y-5'>
            <div className='grid grid-cols-2 gap-4'>
                {deliveries.map((delivery) => (
                    <AddressItem delivery={delivery} isChecked={delivery.id === checked ?? false} key={delivery.id} />
                ))}
            </div>
            <form className='space-y-5'>
                <Input rootClassName='flex' lable='Họ tên' lableClassName='basis-1/4 flex-shrink-0' />
                <Input rootClassName='flex' lable='Địa chỉ' lableClassName='basis-1/4 flex-shrink-0' />
                <Input rootClassName='flex' lable='Số điện thoại' lableClassName='basis-1/4 flex-shrink-0' />
                <div className='flex justify-end space-x-4'>
                    <Button text='Hủy' className='bg-red-500 hover:bg-red-600' />
                    <Button text='Lưu' />
                </div>
            </form>
        </section>
    )
}

export default Step2
