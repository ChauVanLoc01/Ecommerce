import { useRef } from 'react'

import classNames from 'classnames'
import { FaFacebookSquare, FaGoogle } from 'react-icons/fa'
import { FaApple } from 'react-icons/fa6'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import { IoSettingsOutline } from 'react-icons/io5'
import { MdPeopleOutline } from 'react-icons/md'
import { PiDotsThreeOutlineVerticalDuotone } from 'react-icons/pi'
import { SlLock } from 'react-icons/sl'

import Button from 'src/components/Button'

type CardProps = {
    rootClassName?: string
}

const CardProfile = ({ rootClassName }: CardProps) => {
    const fileRef = useRef<HTMLInputElement>(null)

    const handleOpenFile = () => {
        fileRef.current?.click()
    }

    return (
        <div
            className={classNames(
                'p-24 border border-border/30 rounded-8 bg-white space-y-8 relative',
                rootClassName
            )}
        >
            <section className='space-y-2 text-center'>
                <button
                    className='w-20 h-20 rounded-full border border-dashed border-blue object-cover mx-auto overflow-hidden relative hover:after:content-[url("https://cdn-icons-png.flaticon.com/512/2951/2951086.png")] hover:after:inline-block hover:after:w-20 hover:after:h-20 hover:after:absolute hover:after:inset-0 hover:after:bg-white after:ease-in-out after:duration-300 after:transition-all'
                    onClick={handleOpenFile}
                >
                    <img
                        src='https://cdn-icons-png.flaticon.com/512/2202/2202112.png'
                        alt='background'
                    />
                </button>
                <input
                    type='file'
                    ref={fileRef}
                    name=''
                    id=''
                    className='hidden'
                />
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
                <Button
                    iconLeft={<HiOutlineInformationCircle />}
                    text='Thông Tin Cửa Hàng'
                    type='outline'
                    rootClassNames='!text-text_2 hover:bg-blue/20 hover:!text-blue w-full'
                />
                <Button
                    iconLeft={<SlLock />}
                    text='Thay Đổi Mật Khẩu'
                    type='outline'
                    rootClassNames='!text-text_2 hover:bg-blue/20 hover:!text-blue w-full'
                />
                <Button
                    iconLeft={<MdPeopleOutline />}
                    text='Quản Lý Phân Quyền'
                    type='outline'
                    rootClassNames='!text-text_2 hover:bg-blue/20 hover:!text-blue w-full'
                />
                <Button
                    iconLeft={<IoSettingsOutline />}
                    text='Cài Đặt Hệ Thống'
                    type='outline'
                    rootClassNames='!text-text_2 hover:bg-blue/20 hover:!text-blue w-full'
                />
            </section>
            <button className='absolute -top-6 right-2 p-8 rounded-8 bg-text_2/[0.05] hover:bg-text_2/[0.15]'>
                <PiDotsThreeOutlineVerticalDuotone
                    color='rgb(91, 107, 121, 0.85)'
                    className='rotate-90'
                />
            </button>
        </div>
    )
}

export default CardProfile
