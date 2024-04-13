import { Flex, Heading } from '@radix-ui/themes'

import Login from './Login'

const Auth = () => {
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
                        <Heading as='h4'>Đăng Nhập</Heading>
                    </Flex>
                </section>
                <Login />
            </div>
        </div>
    )
}

export default Auth
