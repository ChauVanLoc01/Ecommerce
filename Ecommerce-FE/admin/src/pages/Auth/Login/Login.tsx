import { Button, Checkbox, Flex, Text, TextField } from '@radix-ui/themes'
import { Link } from 'react-router-dom'
import InputPassword from 'src/components/InputPassword'

const Login = () => {
    return (
        <>
            <section className='space-y-2'>
                <h3 className='text-lg'>Tài Khoản</h3>
                <TextField.Root size='3' />
            </section>
            <section className='space-y-2'>
                <h3 className='text-lg'>Mật Khẩu</h3>
                <InputPassword />
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
        </>
    )
}

export default Login
