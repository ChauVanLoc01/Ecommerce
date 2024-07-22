import { useContext, useRef } from 'react'

import classNames from 'classnames'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { FaFacebookSquare, FaGoogle } from 'react-icons/fa'
import { FaApple } from 'react-icons/fa6'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import { IoSettingsOutline } from 'react-icons/io5'
import { MdPeopleOutline } from 'react-icons/md'
import { PiDotsThreeOutlineVerticalDuotone } from 'react-icons/pi'

import { LockClosedIcon } from '@radix-ui/react-icons'
import { resolvePath, useLocation, useNavigate } from 'react-router-dom'
import Button from 'src/components/Button'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { cn } from 'src/utils/utils'

type CardProps = {
    rootClassName?: string
}

const CardProfile = ({ rootClassName }: CardProps) => {
    const { store } = useContext(AppContext)

    const fileRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const location = useLocation()

    const handleOpenFile = () => {
        fileRef.current?.click()
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
                    className='w-20 h-20 rounded-full border border-dashed border-blue object-cover mx-auto overflow-hidden relative group'
                    onClick={handleOpenFile}
                >
                    <img
                        src={store?.image}
                        alt='background'
                        className='group-hover:opacity-0 transition-all duration-100 ease-linear rounded-full'
                    />
                    <span className='opacity-0 absolute inset-0 flex justify-center items-center bg-white group-hover:opacity-100 transition-all duration-100 ease-linear rounded-full delay-100'>
                        <AiOutlineCloudUpload size={30} className='w-full hful text-blue' />
                    </span>
                </button>
                <input type='file' ref={fileRef} name='' id='' className='hidden' />
                <h4 className='font-semibold'>{store?.name}</h4>
                <p>{store?.role}</p>
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
                <Button
                    iconLeft={<HiOutlineInformationCircle />}
                    text='Thông Tin Cửa Hàng'
                    type='outline'
                    rootClassNames={cn('text-gray-500 w-full', {
                        'bg-blue/20 text-blue': location.pathname === resolvePath(route.profile, route.root).pathname
                    })}
                    onClick={() => navigate(`/${route.profile}`)}
                />
                <Button
                    text='Thay Đổi Mật Khẩu'
                    type='outline'
                    iconLeft={<LockClosedIcon />}
                    rootClassNames={cn('text-gray-500 w-full', {
                        'bg-blue/20 text-blue': location.pathname === `/${route.profile}/${route.changePassword}`
                    })}
                    onClick={() => navigate(route.changePassword)}
                />
                <Button
                    iconLeft={<MdPeopleOutline />}
                    text='Quản Lý Phân Quyền'
                    type='outline'
                    rootClassNames={cn('text-gray-500 w-full', {
                        'bg-blue/20 text-blue': location.pathname === `/${route.profile}/${route.permission}`
                    })}
                    onClick={() => navigate(route.permission)}
                />
                <Button
                    iconLeft={<IoSettingsOutline />}
                    text='Cài Đặt Hệ Thống'
                    type='outline'
                    rootClassNames={cn('text-gray-500 w-full', {
                        'bg-blue/20 text-blue': location.pathname === `/${route.profile}/${route.setting}`
                    })}
                    onClick={() => navigate(route.setting)}
                />
            </section>
            <button className='absolute -top-6 right-2 p-8 rounded-8 bg-text_2/[0.05] hover:bg-text_2/[0.15]'>
                <PiDotsThreeOutlineVerticalDuotone color='rgb(91, 107, 121, 0.85)' className='rotate-90' />
            </button>
        </div>
    )
}

export default CardProfile
