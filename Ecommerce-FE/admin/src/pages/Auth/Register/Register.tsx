import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Checkbox, Container, Flex, Grid, Text, TextField } from '@radix-ui/themes'
import classNames from 'classnames'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import InputPassword from 'src/components/InputPassword'
import { register_schema, RegisterSchemaType } from 'src/utils/auth.schema'

const Register = () => {
    const {
        control,
        formState: {
            errors: { confirm_password, email, full_name, password, username }
        },
        handleSubmit
    } = useForm<RegisterSchemaType>({
        resolver: yupResolver(register_schema)
    })

    const onSubmit: SubmitHandler<RegisterSchemaType> = (data) => {
        console.log('data', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
            <section className='space-y-2'>
                <Flex justify='between' align='center'>
                    <h3 className='text-lg'>Họ tên</h3>
                    <span
                        className={classNames('text-rose-600', {
                            hidden: !full_name?.message
                        })}
                    >
                        {full_name?.message}
                    </span>
                </Flex>
                <Controller
                    name='full_name'
                    control={control}
                    render={({ field }) => <TextField.Root {...field} size='3' />}
                />
            </section>
            <section className='space-y-2'>
                <Grid columns='2' gap='5'>
                    <Container>
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
                    </Container>
                    <Container>
                        <Flex justify='between' align='center'>
                            <h3 className='text-lg'>Email</h3>
                            <span
                                className={classNames('text-rose-600', {
                                    hidden: !email?.message
                                })}
                            >
                                {email?.message}
                            </span>
                        </Flex>
                        <Controller
                            name='email'
                            control={control}
                            render={({ field }) => <TextField.Root {...field} size='3' />}
                        />
                    </Container>
                </Grid>
            </section>
            <section className='space-y-2'>
                <Grid columns='2' gap='5'>
                    <Container>
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
                        <Controller
                            name='password'
                            control={control}
                            render={({ field }) => <InputPassword field={field} />}
                        />
                    </Container>
                    <Container>
                        <Flex justify='between' align='center'>
                            <h3 className='text-lg'>Nhập lại mật khẩu</h3>
                            <span
                                className={classNames('text-rose-600', {
                                    hidden: !confirm_password?.message
                                })}
                            >
                                {confirm_password?.message}
                            </span>
                        </Flex>
                        <Controller
                            name='confirm_password'
                            control={control}
                            render={({ field }) => <InputPassword field={field} />}
                        />
                    </Container>
                </Grid>
            </section>
            <section className='flex items-center justify-between'>
                <Text as='label' size='2'>
                    <Flex gap='2' align='center'>
                        <Checkbox size='2' defaultChecked />
                        Đồng ý với chính sách của shop
                    </Flex>
                </Text>
            </section>
            <Button className='!w-full' size='3'>
                Đăng Ký
            </Button>
        </form>
    )
}

export default Register
