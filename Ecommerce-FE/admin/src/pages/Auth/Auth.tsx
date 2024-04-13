import { Button, Checkbox, Flex, SegmentedControl, Text, TextField } from '@radix-ui/themes'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import InputPassword from 'src/components/InputPassword'
import Login from './Login'
import Register from './Register'

const Auth = () => {
    const [auth, setAuth] = useState<'login' | 'register'>('login')

    return (
        <div className='flex items-center justify-center bg-[#F3F4F7] w-full h-screen relative'>
            <div className='inset-0 blur-xl absolute -z-10' />
            <div className='w-1/3 borlder-border rounded-8 p-48 space-y-5 shadow-lg backdrop-blur-xl bg-[#F9FAFB]'>
                <section className='w-20 h-20 rounded-full mx-auto'>
                    <img
                        src='https://cdn-icons-png.flaticon.com/128/4151/4151729.png'
                        alt=''
                        className='object-cover'
                    />
                </section>
                <section className='space-y-4'>
                    <Flex justify='center'>
                        <SegmentedControl.Root
                            value={auth}
                            onValueChange={(value) => setAuth(value as any)}
                            size='3'
                            variant='surface'
                        >
                            <SegmentedControl.Item value='login'>Đăng Nhập</SegmentedControl.Item>
                            <SegmentedControl.Item value='register'>Đăng Ký</SegmentedControl.Item>
                        </SegmentedControl.Root>
                    </Flex>
                </section>
                {auth === 'login' ? <Login /> : <Register />}
            </div>
        </div>
    )
}

export default Auth
