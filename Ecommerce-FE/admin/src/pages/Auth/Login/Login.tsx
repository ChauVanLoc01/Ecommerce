import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Checkbox, Flex, Text, TextField } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { useRef } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthAPI } from 'src/apis/auth.api'
import InputPassword from 'src/components/InputPassword'
import { route } from 'src/constants/route'
import { login_schema, LoginSchemaType } from 'src/utils/auth.schema'
import { ls } from 'src/utils/localStorage'

const Login = () => {
    const redirectRef = useRef<any>(undefined)
    const navigate = useNavigate()
    const {
        control,
        formState: {
            errors: { password, username }
        },
        handleSubmit
    } = useForm<LoginSchemaType>({
        resolver: yupResolver(login_schema)
    })

    const { mutate } = useMutation({
        mutationFn: (body: LoginSchemaType) => AuthAPI.login(body),
        onSuccess: (data) => {
            ls.setItem('profile', JSON.stringify(data.data.result))
            toast.info('Đăng nhập thành công', {
                description: 'Chuyển đến trang chủ trong 3s kế tiếp',
                action: {
                    label: 'Trang chủ',
                    onClick: () => {
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
        onError: () => {
            toast.error('Đăng nhập không thành công')
        }
    })

    const onSubmit: SubmitHandler<LoginSchemaType> = (data) => mutate(data)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <section className='space-y-2'>
                <Flex justify='between' align='center'>
                    <h3 className='text-lg'>Tài Khoản</h3>
                    <span
                        className={classNames('text-rose-600', {
                            hidden: !username?.message
                        })}
                    >
                        {username?.message}
                    </span>
                </Flex>
                <Controller
                    name='username'
                    control={control}
                    render={({ field }) => <TextField.Root {...field} size='3' />}
                />
            </section>
            <section className='space-y-2'>
                <Flex justify='between' align='center'>
                    <h3 className='text-lg'>Mật Khẩu</h3>
                    <span
                        className={classNames('text-rose-600', {
                            hidden: !password?.message
                        })}
                    >
                        {password?.message}
                    </span>
                </Flex>
                <Controller name='password' control={control} render={({ field }) => <InputPassword field={field} />} />
            </section>
            <section className='flex items-center justify-between'>
                <Text as='label' size='2'>
                    <Flex gap='2' align='center'>
                        <Checkbox size='2' defaultChecked />
                        Ghi nhớ
                    </Flex>
                </Text>
                <Link to={'/'} className='text-blue hover:underline hover:underline-offset-4 hover:decorate-[1px]'>
                    Quên mật khẩu
                </Link>
            </section>
            <Button className='!w-full' size='3'>
                Đăng Nhập
            </Button>
        </form>
    )
}

export default Login
