import { Link } from 'react-router-dom'

import Button from 'src/components/Button'
import Checkbox from 'src/components/Checkbox'
import Input from 'src/components/Input'
import InputPassword from 'src/components/InputPassword'

const Login = () => {
    return (
        <div className='flex items-center justify-center bg-gradient-to-br from-[#4ECDC4] to-[#556270] w-full h-screen relative'>
            <div className='inset-0 blur-xl absolute -z-10' />
            <div className='w-1/3 h-2/3 borlder-border rounded-8 p-48 space-y-5 shadow-lg backdrop-blur-xl bg-[#F9FAFB]'>
                <section className='w-20 h-20 rounded-full mx-auto'>
                    <img
                        src='https://cdn-icons-png.flaticon.com/128/4151/4151729.png'
                        alt=''
                        className='object-cover'
                    />
                </section>
                <section className='space-y-4'>
                    <h2 className='font-semibold text-center text-2xl tracking-wider'>
                        Đăng Nhập
                    </h2>
                    <section className='space-y-2'>
                        <h3 className='text-lg'>Tài Khoản</h3>
                        <Input />
                    </section>
                    <section className='space-y-2'>
                        <h3 className='text-lg'>Mật Khẩu</h3>
                        <InputPassword />
                    </section>
                    <section className='flex items-center justify-between'>
                        <Checkbox title='Ghi Nhớ' checked={true} />
                        <Link
                            to={'/'}
                            className='text-blue hover:underline hover:underline-offset-4 hover:decorate-[1px]'
                        >
                            Quên mật khẩu
                        </Link>
                    </section>
                </section>
                <Button
                    text='Đăng Nhập'
                    rootClassNames='w-full flex items-center justify-center'
                />
            </div>
        </div>
    )
}

export default Login
