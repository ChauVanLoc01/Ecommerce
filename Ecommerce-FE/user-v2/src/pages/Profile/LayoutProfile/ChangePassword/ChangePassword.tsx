import Button from 'src/components/Button'
import InputPassword from 'src/components/InputPassword'

import LayoutProfile from '..'

const ChangePassword = () => {
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
                    <section className='flex items-center justify-end gap-x-3'>
                        <Button
                            className='px-5 bg-red-500 hover:bg-red-600'
                            text='Hủy'
                        />
                        <Button className='px-5' text='Lưu' />
                    </section>
                </div>
                <div className='basis-1/2 space-y-2'>
                    <h3 className='text-xl font-semibold'>
                        Mật khẩu phải chứa:
                    </h3>
                    <div className='space-y-1 divide-y'>
                        <p className='py-3 before:content-["-"] before:font-semibold before:mr-2'>
                            Ít nhất 8 kí tự
                        </p>
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

export default ChangePassword
