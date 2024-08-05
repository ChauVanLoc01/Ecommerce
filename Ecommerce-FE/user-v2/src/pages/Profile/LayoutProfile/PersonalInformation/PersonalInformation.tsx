import Input from 'src/components/Input'

import { DevTool } from '@hookform/devtools'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Spinner } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { useContext, useState } from 'react'
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
    const [date, setDate] = useState<Date | undefined>(
        profile?.user?.birthday ? new Date(profile?.user?.birthday) : undefined
    )
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
            address: profileDataLoader?.address,
            email: profileDataLoader?.email,
            full_name: profileDataLoader?.full_name
        },
        resolver: yupResolver(profile_schema)
    })

    const { mutate, isPending } = useMutation({
        mutationFn: profileFetching.updateProfile,
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
            toast.error('Lỗi! Cập nhật thông tin thất bại')
        }
    })

    const onSubmit1: SubmitHandler<ProfileSchemaType> = (e) => {
        mutate({
            ...e,
            birthday: date ? date.toISOString() : undefined
        })
    }

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
                            <section className='space-y-2'>
                                <h4>Ngày sinh:</h4>
                                <DatePicker date={date} setDate={setDate} />
                            </section>
                        </section>
                    </section>
                    <section className='basis-1/2 space-y-5'>
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
                </div>
                <section className='flex items-center justify-end space-x-4 mt-5'>
                    <Button variant='outline' color='red' type='reset' size={'3'}>
                        Hủy
                    </Button>
                    <Button type='submit' size={'3'}>
                        {isPending && <Spinner />}
                        Lưu thay đổi
                    </Button>
                </section>
            </form>
            <DevTool control={control} />
        </LayoutProfile>
    )
}

export default PersonalInformation
