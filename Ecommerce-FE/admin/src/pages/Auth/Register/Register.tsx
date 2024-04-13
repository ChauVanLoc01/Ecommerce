import { Button, Checkbox, Container, Flex, Grid, Text, TextField } from '@radix-ui/themes'
import { Link } from 'react-router-dom'
import InputPassword from 'src/components/InputPassword'

const Register = () => {
    return (
        <>
            <section className='space-y-2'>
                <h3 className='text-lg'>Họ tên</h3>
                <TextField.Root size='3' />
            </section>
            <section className='space-y-2'>
                <Grid columns='2' gap='4'>
                    <Container>
                        <h3 className='text-lg'>Tài Khoản</h3>
                        <TextField.Root size='3' />
                    </Container>
                    <Container>
                        <h3 className='text-lg'>Email</h3>
                        <TextField.Root size='3' />
                    </Container>
                </Grid>
            </section>
            <section className='space-y-2'>
                <Grid columns='2' gap='4'>
                    <Container>
                        <h3 className='text-lg'>Mật Khẩu</h3>
                        <InputPassword />
                    </Container>
                    <Container>
                        <h3 className='text-lg'>Nhập lại mật khẩu</h3>
                        <InputPassword />
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
        </>
    )
}

export default Register
