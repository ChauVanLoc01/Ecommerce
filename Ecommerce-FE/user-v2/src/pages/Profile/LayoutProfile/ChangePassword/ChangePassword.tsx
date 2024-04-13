import Button from 'src/components/Button'
import InputPassword from 'src/components/InputPassword'

import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { profileFetching } from 'src/apis/profile'
import { change_password_schema, ChangePasswordSchemaType } from 'src/utils/profile.schema'
import LayoutProfile from '..'

const ChangePassword = () => {
    const {
        register,
        handleSubmit,
        formState: {
            errors: { confirm_new_password, current_password, new_password }
        },
        setError,
        reset
    } = useForm<ChangePasswordSchemaType>({
        resolver: yupResolver(change_password_schema)
    })

    const { mutate } = useMutation({
        mutationFn: (body: Omit<ChangePasswordSchemaType, 'confirm_new_password'>) =>
            profileFetching.changePassword(body),
        onSuccess: () => {
            reset()
            toast.info('Cập nhật mật khẩu thành công')
        },
        onError: (e) => {
            toast.error('Đã có lỗi xảy ra')
            if (axios.isAxiosError(e) && e.response?.status == 400) {
                if (e.response?.data.message === 'Mật khẩu hiện tại không đúng') {
                    setError('current_password', {
                        message: e.response.data.message
                    })
                } else {
                    setError('new_password', {
                        message: e.response.data.message
                    })
                }
            }
        }
    })

    const onSubmit: SubmitHandler<ChangePasswordSchemaType> = (e) =>
        mutate({ current_password: e.current_password, new_password: e.new_password })

    return (
        <LayoutProfile title='Thay đổi mật khẩu'>
            <form onSubmit={handleSubmit(onSubmit)} className='flex gap-x-48'>
                <div className='basis-1/2 space-y-5'>
                    <section className='space-y-2'>
                        <div className='flex justify-between'>
                            <h4>Mật khẩu cũ:</h4> <span className='text-red-600'>{current_password?.message}</span>
                        </div>
                        <InputPassword register={register('current_password')} />
                    </section>
                    <section className='space-y-2'>
                        <div className='flex justify-between'>
                            <h4>Mật khẩu mới:</h4> <span className='text-red-600'>{new_password?.message}</span>
                        </div>
                        <InputPassword register={register('new_password')} />
                    </section>
                    <section className='space-y-2'>
                        <div className='flex justify-between'>
                            <h4>Nhập lại mật khẩu:</h4>
                            <span className='text-red-600'>{confirm_new_password?.message}</span>
                        </div>
                        <InputPassword register={register('confirm_new_password')} />
                    </section>
                    <section className='flex items-center justify-end gap-x-3'>
                        <Button className='px-5 bg-red-500 hover:bg-red-600' text='Hủy' />
                        <Button className='px-5' type='submit' text='Lưu' />
                    </section>
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

export default ChangePassword
