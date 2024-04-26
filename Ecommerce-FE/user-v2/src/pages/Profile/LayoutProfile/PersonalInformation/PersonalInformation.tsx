import Button from 'src/components/Button'
import Input from 'src/components/Input'

import { DevTool } from '@hookform/devtools'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useLoaderData } from 'react-router-dom'
import { toast } from 'sonner'
import { profileFetching } from 'src/apis/profile'
import { DatePicker } from 'src/components/Shadcn/datepicker'
import { Textarea } from 'src/components/Shadcn/textarea'
import { AppContext } from 'src/contexts/AppContext'
import { LoginResponse } from 'src/types/auth.type'
import { ProfileResponse } from 'src/types/profile.type'
import { ls } from 'src/utils/localStorage'
import { profile_schema, ProfileSchemaType } from 'src/utils/profile.schema'
import LayoutProfile from '..'

const PersonalInformation = () => {
    const { profile, setProfile } = useContext(AppContext)
    const [profileDataLoader] = useLoaderData() as [ProfileResponse]
    const {
        register,
        handleSubmit,
        control,
        formState: {
            errors: { address, full_name, email }
        }
    } = useForm<ProfileSchemaType>({
        defaultValues: {
            address: profileDataLoader.address,
            email: profileDataLoader.email,
            full_name: profileDataLoader.full_name
        },
        resolver: yupResolver(profile_schema)
    })

    const { mutate } = useMutation({
        mutationFn: (body: ProfileSchemaType & { image?: string }) => profileFetching.updateProfile(body),
        onSuccess: (e) => {
            const newProfile = {
                ...profile,
                user: {
                    storeRoleId: profile?.user.storeRoleId,
                    ...(e.data.result as any)
                }
            } as LoginResponse
            ls.setItem('profile', JSON.stringify(newProfile))
            setProfile(newProfile)
            toast.info('Cập nhật thông tin thành công')
        },
        onError: () => {
            toast.error('Đã có lỗi xảy ra')
        }
    })

    const onSubmit1: SubmitHandler<ProfileSchemaType> = (e) => mutate(e)

    return (
        <LayoutProfile title='Thông tin cá nhân'>
            <form onSubmit={handleSubmit(onSubmit1)}>
                <div className='flex gap-x-10'>
                    <section className='basis-1/2 space-y-5'>
                        <section className='space-y-2'>
                            <div className='flex justify-between'>
                                <h4>Tên:</h4> <span className='text-red-600'>{full_name?.message}</span>
                            </div>
                            <Input register={register('full_name')} />
                        </section>
                        <section className='space-y-2'>
                            <div className='flex justify-between'>
                                <h4>Email:</h4> <span className='text-red-600'>{email?.message}</span>
                            </div>
                            <Input register={register('email')} />
                        </section>
                        <section className='space-y-2 flex-grow-0'>
                            <div className='flex justify-between'>
                                <h4>Địa chỉ:</h4> <span className='text-red-600'>{address?.message}</span>
                            </div>
                            <Textarea {...register('address')} />
                        </section>
                    </section>
                    <section className='basis-1/2 space-y-5'>
                        {/* <section className='space-y-2'>
                                <h4>Tài khoản:</h4>
                                <Input />
                            </section> */}
                        <section className='space-y-2'>
                            <h4>Số điện thoại:</h4>
                            <Input />
                        </section>
                        <section className='space-y-2'>
                            <h4>Ngày sinh:</h4>
                            <DatePicker />
                        </section>
                    </section>
                </div>
                <section className='flex items-center justify-end space-x-5 mt-5'>
                    <Button text='Hủy thay đổi' className='bg-red-600 hover:bg-red-700' />
                    <Button type='submit' text='Lưu' />
                </section>
            </form>
            <DevTool control={control} />
        </LayoutProfile>
    )
}

export default PersonalInformation
