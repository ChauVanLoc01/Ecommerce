import InputPassword from 'src/components/InputPassword'
import LayoutProfile from '..'
import { Button, Flex } from '@radix-ui/themes'

const Password = () => {
    return (
        <LayoutProfile title='Thay đổi mật khẩu'>
            <form className='flex gap-x-48'>
                <div className='basis-1/2 space-y-5'>
                    <section className='space-y-2'>
                        <h4>Mật khẩu cũ:</h4>
                        <InputPassword />
                    </section>
                    <section className='space-y-2'>
                        <h4>Mật khẩu mới:</h4>
                        <InputPassword />
                    </section>
                    <section className='space-y-2'>
                        <h4>Nhập lại mật khẩu:</h4>
                        <InputPassword />
                    </section>
                    <Flex justify='end' gap='4'>
                        <Button size='3' color='red' type='reset' variant='surface'>
                            Hủy
                        </Button>
                        <Button size='3'>Thay đổi</Button>
                    </Flex>
                </div>
                <div className='basis-1/2 space-y-2'>
                    <h3 className='text-xl font-semibold'>Mật khẩu phải chứa:</h3>
                    <div className='space-y-1 divide-y'>
                        <p className='py-3 before:content-["-"] before:font-semibold before:mr-2'>Ít nhất 8 kí tự</p>
                        <p className='py-3 before:content-["-"] before:font-semibold before:mr-2'>
                            Ít nhất 1 kí tự viết hoa (A-Z)
                        </p>
                        <p className='py-3 before:content-["-"] before:font-semibold before:mr-2'>
                            Ít nhất 1 kí tự viết thường (a-z)
                        </p>
                        <p className='py-3 before:content-["-"] before:font-semibold before:mr-2'>
                            Ít nhất 1 kí tự số (0 - 9)
                        </p>
                        <p className='py-3 before:content-["-"] before:font-semibold before:mr-2'>
                            Ít nhất 1 kí tự đặt biệt
                        </p>
                    </div>
                </div>
            </form>
        </LayoutProfile>
    )
}

export default Password
