import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Checkbox, Flex, Spinner, Text, TextField } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { AuthAPI } from 'src/apis/auth.api'
import InputPassword from 'src/components/InputPassword'
import { AppContext } from 'src/contexts/AppContext'
import { login_schema, LoginSchemaType } from 'src/utils/auth.schema'
import { ls } from 'src/utils/localStorage'

const Login = () => {
    const { setProfile, setStore } = useContext(AppContext)
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

    const { mutate, isPending } = useMutation({
        mutationFn: (body: LoginSchemaType) => AuthAPI.login(body),
        onSuccess: (data) => {
            setProfile(data.data.result.user)
            setStore(data.data.result.store)
            ls.setItem('profile', JSON.stringify(data.data.result.user))
            ls.setItem('store', JSON.stringify(data.data.result.store))
            navigate('/analytic')
            toast.info('Đăng nhập thành công')
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
                {isPending && <Spinner />}
                Đăng Nhập
            </Button>
        </form>
    )
}

export default Login
