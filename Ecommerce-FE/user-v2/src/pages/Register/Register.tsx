import { Link } from 'react-router-dom'

import Button from 'src/components/Button'
import Image from 'src/components/Image'
import Input from 'src/components/Input'
import Password from 'src/components/Password'
import { route } from 'src/constants/route'

const Register = () => {
    return (
        <div className='flex w-screen h-screen overflow-hidden'>
            <Image
                src='https://ableproadmin.com/react/static/media/img-auth-sideimg.d011b7b8eab5547b4c21.png'
                alt='img-authentication'
                rootClassName='basis-3/5 object-cover flex-shrink-0'
                className='object-cover'
            />
            <main className='w-[25%] mx-auto py-16 space-y-4 flex flex-col justify-center'>
                <section className='text-center'>
                    <Link to={route.root} className='inline-block'>
                        <img
                            src='https://cdn-icons-png.flaticon.com/128/4151/4151729.png'
                            alt='logo'
                            className='object-cover w-20 h-20'
                        />
                    </Link>
                </section>
                <section className='flex items-baseline justify-between'>
                    <h3 className='text-2xl font-semibold'>Đăng kí</h3>
                    <Link
                        to={`/${route.login}`}
                        className='text-blue-600 text-base'
                    >
                        Đã có tài khoản
                    </Link>
                </section>
                <Input
                    lable='Họ tên'
                    htmlFor='name'
                    placeholder='Nhập vào tên của bạn'
                />
                <Input
                    lable='Email'
                    htmlFor='email'
                    placeholder='Nhập vào email của bạn'
                />
                <Password
                    lable='Mật khẩu'
                    htmlFor='password'
                    placeholder='Nhập vào mật khẩu của bạn'
                />
                <Password
                    lable='Nhập lại mật khẩu'
                    htmlFor='password'
                    placeholder='Nhập lại mật khẩu của bạn'
                />
                <section className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                        <input
                            type='checkbox'
                            className='shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none'
                            id='remember'
                        />
                        <label
                            htmlFor='remember'
                            className='text-sm text-gray-700'
                        >
                            Tôi đồng ý với các điều khoản và điều kiện
                        </label>
                    </div>
                </section>
                <section>
                    <Button text='Đăng kí' className='w-full' />
                </section>
            </main>
        </div>
    )
}

export default Register
