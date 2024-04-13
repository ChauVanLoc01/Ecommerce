import { DatePicker } from 'antd'

import Button from 'src/components/Button'
import Dropdown from 'src/components/Dropdown'
import Input from 'src/components/Input'

import LayoutProfile from '..'

const PersonalInformation = () => {
    return (
        <LayoutProfile title='Thông tin cá nhân'>
            <div className='flex gap-x-10'>
                <section className='basis-1/2 space-y-5'>
                    <section className='space-y-2'>
                        <h4>Tên:</h4>
                        <Input />
                    </section>
                    <section className='space-y-2'>
                        <h4>Email:</h4>
                        <Input />
                    </section>
                    <section className='space-y-2 flex-grow-0'>
                        <h4>Ngày sinh:</h4>
                        <DatePicker
                            rootClassName='px-16 py-8 w-full text-[18px]'
                            placeholder=''
                        />
                    </section>
                </section>
                <section className='basis-1/2 space-y-5'>
                    <section className='space-y-2'>
                        <h4>Họ:</h4>
                        <Input />
                    </section>
                    <section className='space-y-2'>
                        <h4>Số điện thoại:</h4>
                        <Input />
                    </section>
                    <section className='space-y-2'>
                        <h4>Số điện thoại:</h4>
                        <Dropdown
                            data={{
                                '1': '1',
                                '2': '2',
                                '3': '3',
                                '4': '4',
                                '5': '5',
                                '6': '6',
                                '7': '7'
                            }}
                        />
                    </section>
                </section>
            </div>
            <section className='flex items-center justify-end space-x-5 mt-5'>
                <Button
                    text='Hủy thay đổi'
                    rootClassNames='bg-red hover:bg-red_hover'
                />
                <Button text='Lưu' />
            </section>
        </LayoutProfile>
    )
}

export default PersonalInformation
