import { DatePicker } from 'antd'

import LayoutProfile from '..'
import { Button, Flex, TextField } from '@radix-ui/themes'

const PersonalInformation = () => {
    return (
        <LayoutProfile title='Thông tin cá nhân'>
            <form className='space-y-5'>
                <div className='flex gap-x-10'>
                    <section className='basis-1/2 space-y-5'>
                        <section className='space-y-1'>
                            <h4>Tên:</h4>
                            <TextField.Root size='3' />
                        </section>
                        <section className='space-y-1'>
                            <h4>Email:</h4>
                            <TextField.Root size='3' />
                        </section>
                        <section className='space-y-1 flex-grow-0'>
                            <h4>Ngày sinh:</h4>
                            <DatePicker rootClassName='px-16 py-8 w-full text-[18px]' placeholder='' />
                        </section>
                    </section>
                    <section className='basis-1/2 space-y-5'>
                        <section className='space-y-1'>
                            <h4>Họ:</h4>
                            <TextField.Root size='3' />
                        </section>
                        <section className='space-y-1'>
                            <h4>Số điện thoại:</h4>
                            <TextField.Root size='3' />
                        </section>
                        <section className='space-y-1'>
                            <h4>Số điện thoại:</h4>
                            <TextField.Root size='3' />
                        </section>
                    </section>
                </div>
                <Flex justify='end' gap='4'>
                    <Button size='3' color='red' type='reset' variant='surface'>
                        Hủy
                    </Button>
                    <Button size='3'>Thay đổi</Button>
                </Flex>
            </form>
        </LayoutProfile>
    )
}

export default PersonalInformation
