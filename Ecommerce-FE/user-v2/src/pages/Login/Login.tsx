import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { authFetching } from 'src/apis/authentication'

import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import classNames from 'classnames'
import { useContext, useRef } from 'react'
import Button from 'src/components/Button'
import Image from 'src/components/Image'
import Input from 'src/components/Input'
import Password from 'src/components/Password'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { LoginBody } from 'src/types/auth.type'
import { Reject } from 'src/types/return.type'
import { login_schema } from 'src/utils/auth.schema'

const Login = () => {
    const { setProfile } = useContext(AppContext)
    const redirectRef = useRef<any>(undefined)
    const {
        register,
        handleSubmit,
        setError,
        formState: {
            errors: { password, username }
        }
    } = useForm<LoginBody>({
        resolver: yupResolver(login_schema)
    })

    const { mutate, isSuccess, isPending } = useMutation({
        mutationFn: (body: LoginBody) => authFetching.login(body),
        onSuccess: (result) => {
            redirectRef.current = setTimeout(() => {
                setProfile(result.data.result)
            }, 3000)
            toast.success('Đăng nhập thành công', {
                description: 'Chuyển đến trang chủ trong 3s kế tiếp',
                action: {
                    label: 'Trang chủ',
                    onClick: () => {
                        clearTimeout(redirectRef.current)
                        setProfile(result.data.result)
                    }
                },
                icon: (
                    <span>
                        <svg
                            className='animate-spin mr-1 h-4 w-4 text-blue-500'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx={12}
                                cy={12}
                                r={10}
                                stroke='currentColor'
                                strokeWidth={4}
                            />
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            />
                        </svg>
                    </span>
                )
            })
        },
        onError: (error) => {
            if (axios.isAxiosError<Reject>(error) && error.response?.status === 401) {
                if (error.response.data.message === 'Mật khẩu không đúng') {
                    setError('password', { message: 'Không đúng' })
                } else {
                    setError('username', { message: 'Không tồn tại' })
                }
                toast.error(error.response.data.message)
            }
        }
    })

    const onSubmit: SubmitHandler<LoginBody> = (data) => mutate(data)

    return (
        <div className='flex w-screen h-screen overflow-hidden'>
            <Image
                src='https://ableproadmin.com/react/static/media/img-auth-sideimg.d011b7b8eab5547b4c21.png'
                alt='img-authentication'
                rootClassName='basis-3/5 object-cover flex-shrink-0'
                className='object-cover'
            />
            <form onSubmit={handleSubmit(onSubmit)} className='w-[25%] mx-auto flex flex-col justify-center space-y-4'>
                <Link to={'/'}>
                    <img
                        src='https://cdn-icons-png.flaticon.com/128/4151/4151729.png'
                        alt='logo'
                        className='object-cover w-20 h-2w-20 mx-auto'
                    />
                </Link>
                <section className='flex items-baseline justify-between'>
                    <h3 className='text-2xl font-semibold'>Đăng nhập</h3>
                    <Link to={`/${route.register}`} className='text-blue-600 text-base'>
                        Chưa có tài khoản
                    </Link>
                </section>
                <Input
                    lable='Tài khoản'
                    htmlFor='username'
                    placeholder='Nhập vào tài khoản của bạn'
                    register={register('username')}
                    error={username?.message}
                />
                <Password
                    lable='Mật khẩu'
                    htmlFor='password'
                    placeholder='Nhập vào mật khẩu của bạn'
                    register={register('password')}
                    error={password?.message}
                />
                <section className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                        <input
                            type='checkbox'
                            className='shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none'
                            id='remember'
                        />
                        <label htmlFor='remember' className='text-sm text-gray-700'>
                            Ghi nhớ
                        </label>
                    </div>
                    <Link to={`/${route.forgotPassword}`}>Quên mật khẩu</Link>
                </section>
                <section>
                    <Button
                        type='submit'
                        text='Đăng nhập'
                        className={classNames('w-full', {
                            'pointer-events-none': isSuccess
                        })}
                        isLoading={isPending}
                    />
                </section>
            </form>
        </div>
    )
}

export default Login
