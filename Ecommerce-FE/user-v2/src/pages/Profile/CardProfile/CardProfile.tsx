import { useContext, useRef, useState } from 'react'

import classNames from 'classnames'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { FaFacebookSquare, FaGoogle } from 'react-icons/fa'
import { FaApple } from 'react-icons/fa6'
import { MdOutlinePayment } from 'react-icons/md'
import { PiDotsThreeOutlineVerticalDuotone } from 'react-icons/pi'
import { TbTruckDelivery } from 'react-icons/tb'
import { NavLink } from 'react-router-dom'

import { ArchiveIcon, InfoCircledIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { Spinner } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { profileFetching } from 'src/apis/profile'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { LoginResponse } from 'src/types/auth.type'
import { ls } from 'src/utils/localStorage'
import { ProfileSchemaType } from 'src/utils/profile.schema'

type CardProps = {
    rootClassName?: string
}

const CardProfile = ({ rootClassName }: CardProps) => {
    const { profile, setProfile } = useContext(AppContext)
    const [imgUrl, setImgUrl] = useState<string>(
        profile?.user.image ?? 'https://cdn-icons-png.flaticon.com/512/2202/2202112.png'
    )
    const fileRef = useRef<HTMLInputElement>(null)

    const { mutate: updateProfileMutation, isPending: updateUserProfilePending } = useMutation({
        mutationFn: (body: ProfileSchemaType & { image?: string }) => profileFetching.updateProfile(body),
        onSuccess: (e) => {
            const newProfile = {
                ...profile,
                user: {
                    ...profile?.user,
                    image: e.data.result.image
                }
            } as LoginResponse
            ls.setItem('profile', JSON.stringify(newProfile))
            setProfile(newProfile)
            toast.success('Cập nhật hình ảnh thành công')
        },
        onError: () => {
            toast.error('Lỗi cập nhật hình ảnh')
            setImgUrl(profile?.user.image ?? 'https://cdn-icons-png.flaticon.com/512/2202/2202112.png')
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: profileFetching.uploadImage,
        onSuccess: (e) => {
            updateProfileMutation({ image: e.data.result })
        },
        onError: () => {
            toast.error('Lỗi cập nhật hình ảnh')
            setImgUrl(profile?.user.image ?? 'https://cdn-icons-png.flaticon.com/512/2202/2202112.png')
        }
    })

    const handleOpenFile = () => {
        fileRef.current?.click()
    }

    const handleFileChaneg = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (!e.target.files[0].type.startsWith('image')) {
                console.log('1')
                toast.error('File không đúng định dạng Image/*')
                return
            }
            if (e.target.files[0].size > 500000) {
                toast.error('Dung lượng hình ảnh tối đa 500KB')
                return
            }
            setImgUrl(URL.createObjectURL(e.target.files[0]))
            const formData = new FormData()
            formData.append('file', e.target.files[0])
            mutate(formData)
        }
    }

    return (
        <div
            className={classNames(
                'p-24 border border-border/30 rounded-8 bg-white space-y-8 relative shrink-0',
                rootClassName
            )}
        >
            <section className='space-y-2 text-center'>
                <button
                    className='w-28 h-28 rounded-full border border-dashed border-blue-600 object-cover mx-auto overflow-hidden relative group'
                    onClick={handleOpenFile}
                >
                    <img
                        loading='lazy'
                        src={imgUrl}
                        alt='background'
                        className='group-hover:opacity-0 transition-all duration-100 ease-linear rounded-full bg-center'
                    />
                    <span className='opacity-0 absolute inset-0 flex justify-center items-center bg-white group-hover:opacity-100 transition-all duration-100 ease-linear rounded-full delay-100'>
                        <AiOutlineCloudUpload size={30} className='w-full hful text-blue-600' />
                    </span>
                    {(isPending || updateUserProfilePending) && (
                        <div className='bg-gray-100 opacity-60 inset-0 absolute flex justify-center items-center'>
                            <Spinner size={'3'} />
                        </div>
                    )}
                </button>
                <input type='file' onChange={handleFileChaneg} ref={fileRef} name='' id='' className='hidden' />
                <h4 className='font-semibold'>Stebin Ben</h4>
                <p>Admin</p>
                <article className='flex items-center justify-center gap-x-2'>
                    <FaGoogle color='#FF4528' />
                    <FaFacebookSquare color='blue' />
                    <FaApple color='#4D94C8' />
                </article>
            </section>
            <section className='flex divide-x-[1px] divide-border/50'>
                <div className='basis-1/3'>
                    <div className='w-fit mx-auto text-center'>
                        <h2 className='font-semibold'>86</h2>
                        <p className='text-sm'>Chờ</p>
                    </div>
                </div>
                <div className='basis-1/3'>
                    <div className='w-fit mx-auto text-center'>
                        <h2 className='font-semibold'>86</h2>
                        <p className='text-sm'>Tổng</p>
                    </div>
                </div>
                <div className='basis-1/3'>
                    <div className='w-fit mx-auto text-center'>
                        <h2 className='font-semibold'>86</h2>
                        <p className='text-sm'>NV</p>
                    </div>
                </div>
            </section>
            <section className='space-y-1'>
                <NavLink
                    to={`/${route.profile}`}
                    end
                    className={({ isActive }) =>
                        classNames('py-12 flex items-center space-x-[12px] justify-start px-4 relative z-10', {
                            'after:content-[""] after:block after:absolute after:inset-0 after:rounded-8 after:bg-blue-100 text-blue-500 bg-transparent after:-z-10':
                                isActive,
                            'text-gray-500': !isActive
                        })
                    }
                >
                    <InfoCircledIcon width={20} height={20} />
                    <span>Thông tin cá nhân</span>
                </NavLink>
                <NavLink
                    to={`/${route.profile}/${route.order}`}
                    end
                    className={({ isActive }) =>
                        classNames('py-12 flex items-center space-x-[12px] justify-start px-4 relative z-10', {
                            'after:content-[""] after:block after:absolute after:inset-0 after:rounded-8 after:bg-blue-100 text-blue-500 bg-transparent after:-z-10':
                                isActive,
                            'text-gray-500': !isActive
                        })
                    }
                >
                    <ArchiveIcon width={18} height={18} />
                    <span>Đơn hàng đã mua</span>
                </NavLink>
                <NavLink
                    to={`/${route.profile}/${route.changePassword}`}
                    className={({ isActive }) =>
                        classNames('py-12 flex items-center space-x-[12px] justify-start px-4 relative z-10', {
                            'after:content-[""] after:block after:absolute after:inset-0 after:rounded-8 after:bg-blue-100 text-blue-500 bg-transparent after:-z-10':
                                isActive,
                            'text-gray-500': !isActive
                        })
                    }
                >
                    <LockClosedIcon width={20} height={20} />
                    <span>Thay Đổi Mật Khẩu</span>
                </NavLink>
                <NavLink
                    to={`/${route.profile}/${route.address}`}
                    className={({ isActive }) =>
                        classNames('py-12 flex items-center space-x-[12px] justify-start px-4 relative z-10', {
                            'after:content-[""] after:block after:absolute after:inset-0 after:rounded-8 after:bg-blue-100 text-blue-500 bg-transparent after:-z-10':
                                isActive,
                            'text-gray-500': !isActive
                        })
                    }
                >
                    <TbTruckDelivery size={20} />
                    <span>Địa chỉ giao hàng</span>
                </NavLink>
                <NavLink
                    to={`/${route.profile}/${route.payment}`}
                    className={({ isActive }) =>
                        classNames('py-12 flex items-center space-x-[12px] justify-start px-4 relative z-10', {
                            'after:content-[""] after:block after:absolute after:inset-0 after:rounded-8 after:bg-blue-100 text-blue-500 bg-transparent after:-z-10':
                                isActive,
                            'text-gray-500': !isActive
                        })
                    }
                >
                    <MdOutlinePayment />
                    <span>Cài Đặt Thanh Toán</span>
                </NavLink>
            </section>
            <button className='absolute -top-6 right-2 p-8 rounded-8 bg-text_2/[0.05] hover:bg-text_2/[0.15]'>
                <PiDotsThreeOutlineVerticalDuotone color='rgb(91, 107, 121, 0.85)' className='rotate-90' />
            </button>
        </div>
    )
}

export default CardProfile
