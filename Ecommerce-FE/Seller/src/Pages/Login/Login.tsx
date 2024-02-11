import { message } from 'antd'
import { Link } from 'react-router-dom'

import { Path } from 'src/constants/path.enum'

function Login() {
    const [messageApi, contextHolder] = message.useMessage()
    const key = 'updatable'

    const openMessage = () => {
        messageApi.open({
            key,
            type: 'loading',
            content: 'Loading...'
        })
        setTimeout(() => {
            messageApi.open({
                key,
                type: 'success',
                content: 'Loaded!',
                duration: 2
            })
        }, 1000)
    }

    return (
        <section className='bg-gray-50 dark:bg-gray-900'>
            <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
                <div className='w-full rounded-lg shadow-md dark:border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700'>
                    <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
                        <h1 className='text-xl font-bold uppercase text-white text-center leading-tight tracking-wide md:text-2xl'>
                            Đăng nhập
                        </h1>
                        <form className='space-y-4 md:space-y-6' action='#'>
                            <div>
                                <label
                                    htmlFor='email'
                                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                                >
                                    Tài khoản
                                </label>
                                <input
                                    type='email'
                                    name='email'
                                    id='email'
                                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    placeholder='Nhập vào tài khoản của bạn'
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='password'
                                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                                >
                                    Mật khẩu
                                </label>
                                <input
                                    type='password'
                                    name='password'
                                    id='password'
                                    placeholder='••••••••'
                                    className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                    required
                                />
                            </div>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-start'>
                                    <div className='flex items-center h-5'>
                                        <input
                                            id='remember'
                                            aria-describedby='remember'
                                            type='checkbox'
                                            className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300'
                                            required
                                        />
                                    </div>
                                    <div className='ml-3 text-sm'>
                                        <label
                                            htmlFor='remember'
                                            className='text-gray-500 dark:text-gray-300'
                                        >
                                            Ghi nhớ
                                        </label>
                                    </div>
                                </div>
                                <Link
                                    to={Path.forgot_password}
                                    className='text-sm font-medium text-[#3b82f6] hover:underline'
                                >
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <button
                                type='button'
                                onClick={openMessage}
                                className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#3b82f6]'
                            >
                                Đăng nhập
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {contextHolder}
        </section>
    )
}

export default Login
