import Button from 'src/components/Button'
import Input from 'src/components/Input'

import AddressItem from './AddressItem'

const Step2 = () => {
    return (
        <section className='p-24 rounded-8 border border-border/30 bg-[#FFFFFF] space-y-5'>
            <div className='grid grid-cols-2 gap-4'>
                <AddressItem isChecked isPrimary />
                <AddressItem />
                <AddressItem />
            </div>
            <form className='space-y-5'>
                <Input
                    rootClassName='flex'
                    lable='Họ tên'
                    lableClassName='basis-1/4 flex-shrink-0'
                />
                <Input
                    rootClassName='flex'
                    lable='Địa chỉ'
                    lableClassName='basis-1/4 flex-shrink-0'
                />
                <Input
                    rootClassName='flex'
                    lable='Số điện thoại'
                    lableClassName='basis-1/4 flex-shrink-0'
                />
                <div className='flex justify-end space-x-4'>
                    <Button
                        text='Hủy'
                        className='bg-red-500 hover:bg-red-600'
                    />
                    <Button text='Lưu' />
                </div>
            </form>
        </section>
    )
}

export default Step2
