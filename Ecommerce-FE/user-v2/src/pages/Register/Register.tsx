import { yupResolver } from '@hookform/resolvers/yup'
import { Spinner } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import classNames from 'classnames'
import { useContext, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authFetching } from 'src/apis/authentication'

import Button from 'src/components/Button'
import Image from 'src/components/Image'
import Input from 'src/components/Input'
import Password from 'src/components/Password'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { RegisterBody } from 'src/types/auth.type'
import { RegisterSchemaType, register_schema } from 'src/utils/auth.schema'

const Register = () => {
    const { setProfile } = useContext(AppContext)
    const navigate = useNavigate()
    const redirectRef = useRef<any>(undefined)
    const {
        register,
        handleSubmit,
        formState: {
            errors: { confirm_password, email, full_name, password, username }
        },
        setError
    } = useForm<RegisterSchemaType>({
        resolver: yupResolver(register_schema)
    })

    const { mutate, isSuccess, isPending } = useMutation({
        mutationFn: (body: RegisterBody) => authFetching.register(body),
        onSuccess: (result) => {
            redirectRef.current = setTimeout(() => {
                setProfile(result.data.result)
                navigate(route.root)
            }, 3000)
            toast.success('Đăng kí thành công', {
                description: 'Chuyển đến trang chủ trong 3s kế tiếp',
                action: {
                    label: 'Trang chủ',
                    onClick: () => {
                        setProfile(result.data.result)
                        clearTimeout(redirectRef.current)
                        navigate(route.root)
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
            console.log(error)
            if (axios.isAxiosError(error) && error.response?.status === 400) {
                toast.error('Tài khoản đã tồn tại')
                setError('username', { message: 'Đã tồn tại' })
            }
        }
    })

    const onSubmit: SubmitHandler<RegisterSchemaType> = ({ confirm_password, ...rest }) => mutate(rest)

    return (
        <div className='flex w-screen h-screen overflow-hidden'>
            <Image
                src='https://ableproadmin.com/react/static/media/img-auth-sideimg.d011b7b8eab5547b4c21.png'
                alt='img-authentication'
                rootClassName='basis-3/5 object-cover flex-shrink-0'
                className='object-cover'
            />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='w-[25%] mx-auto py-16 space-y-4 flex flex-col justify-center'
            >
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
                    <Link to={`/${route.login}`} className='text-blue-600 text-base'>
                        Đã có tài khoản
                    </Link>
                </section>
                <Input
                    lable='Họ tên'
                    htmlFor='name'
                    placeholder='Nhập vào tên của bạn'
                    register={register('full_name')}
                    error={full_name?.message}
                />
                <Input
                    lable='Tài khoản'
                    htmlFor='name'
                    placeholder='Nhập vào tên của bạn'
                    register={register('username')}
                    error={username?.message}
                />
                <Input
                    lable='Email'
                    htmlFor='email'
                    placeholder='Nhập vào email của bạn'
                    register={register('email')}
                    error={email?.message}
                />
                <Password
                    lable='Mật khẩu'
                    htmlFor='password'
                    placeholder='Nhập vào mật khẩu của bạn'
                    register={register('password')}
                    error={password?.message}
                />
                <Password
                    lable='Nhập lại mật khẩu'
                    htmlFor='password'
                    placeholder='Nhập lại mật khẩu của bạn'
                    register={register('confirm_password')}
                    error={confirm_password?.message}
                />
                <section className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                        <input
                            type='checkbox'
                            className='shrink-0 border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none'
                            id='remember'
                        />
                        <label htmlFor='remember' className='text-sm text-gray-700'>
                            Tôi đồng ý với các điều khoản và điều kiện
                        </label>
                    </div>
                </section>
                <section>
                    <Button
                        type='submit'
                        disabled={isSuccess}
                        text='Đăng kí'
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

export default Register
