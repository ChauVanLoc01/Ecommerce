import { useRef } from 'react'

import classNames from 'classnames'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { BsBoxSeam } from 'react-icons/bs'
import { FaFacebookSquare, FaGoogle } from 'react-icons/fa'
import { FaApple } from 'react-icons/fa6'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import { MdOutlinePayment } from 'react-icons/md'
import { PiDotsThreeOutlineVerticalDuotone } from 'react-icons/pi'
import { SlLock } from 'react-icons/sl'
import { NavLink } from 'react-router-dom'

import { route } from 'src/constants/route'

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
                'p-24 border border-border/30 rounded-8 bg-white space-y-8 relative shrink-0',
                rootClassName
            )}
        >
            <section className='space-y-2 text-center'>
                <button
                    className='w-20 h-20 rounded-full border border-dashed border-blue-600 object-cover mx-auto overflow-hidden relative group'
                    onClick={handleOpenFile}
                >
                    <img
                        src='https://cdn-icons-png.flaticon.com/512/2202/2202112.png'
                        alt='background'
                        className='group-hover:opacity-0 transition-all duration-100 ease-linear rounded-full'
                    />
                    <span className='opacity-0 absolute inset-0 flex justify-center items-center bg-white group-hover:opacity-100 transition-all duration-100 ease-linear rounded-full delay-100'>
                        <AiOutlineCloudUpload
                            size={30}
                            className='w-full hful text-blue-600'
                        />
                    </span>
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
                <NavLink
                    to={`/${route.profile}`}
                    end
                    className={({ isActive }) =>
                        classNames(
                            'py-12 flex items-center space-x-[7px] justify-start px-4 relative z-10',
                            {
                                'after:content-[""] after:block after:absolute after:inset-0 after:rounded-8 after:bg-blue-100 text-blue-500 bg-transparent after:-z-10':
                                    isActive,
                                'text-gray-500': !isActive
                            }
                        )
                    }
                >
                    <HiOutlineInformationCircle />
                    <span>Thông tin cá nhân</span>
                </NavLink>
                <NavLink
                    to={`/${route.profile}/${route.order}`}
                    end
                    className={({ isActive }) =>
                        classNames(
                            'py-12 flex items-center space-x-[7px] justify-start px-4 relative z-10',
                            {
                                'after:content-[""] after:block after:absolute after:inset-0 after:rounded-8 after:bg-blue-100 text-blue-500 bg-transparent after:-z-10':
                                    isActive,
                                'text-gray-500': !isActive
                            }
                        )
                    }
                >
                    <BsBoxSeam />
                    <span>Đơn hàng đã mua</span>
                </NavLink>
                <NavLink
                    to={`/${route.profile}/${route.changePassword}`}
                    className={({ isActive }) =>
                        classNames(
                            'py-12 flex items-center space-x-[7px] justify-start px-4 relative z-10',
                            {
                                'after:content-[""] after:block after:absolute after:inset-0 after:rounded-8 after:bg-blue-100 text-blue-500 bg-transparent after:-z-10':
                                    isActive,
                                'text-gray-500': !isActive
                            }
                        )
                    }
                >
                    <SlLock />
                    <span>Thay Đổi Mật Khẩu</span>
                </NavLink>
                <NavLink
                    to={`/${route.profile}/${route.payment}`}
                    className={({ isActive }) =>
                        classNames(
                            'py-12 flex items-center space-x-[7px] justify-start px-4 relative z-10',
                            {
                                'after:content-[""] after:block after:absolute after:inset-0 after:rounded-8 after:bg-blue-100 text-blue-500 bg-transparent after:-z-10':
                                    isActive,
                                'text-gray-500': !isActive
                            }
                        )
                    }
                >
                    <MdOutlinePayment />
                    <span>Cài Đặt Thanh Toán</span>
                </NavLink>
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
