import { PiShoppingCartLight } from 'react-icons/pi'
import { Link } from 'react-router-dom'
import SimpleBar from 'simplebar-react'

import Button from 'src/components/Button'
import Popover from 'src/components/Popover'

const Header = () => {
    return (
        <header className='pt-3 pb-5'>
            <section className='flex items-center justify-end space-x-2'>
                <Popover
                    referenceChildren={<PiShoppingCartLight size={27} />}
                    referenceClassName='p-8 hover:bg-gray-200 rounded-8 relative after:w-[18px] after:h-[18px] after:rounded-full after:bg-red-600 after:absolute after:top-1 after:right-1 after:content-["2"] after:text-[10px] after:text-white after:flex after:items-center after:justify-center'
                    floatingClassName='p-[24px] bg-[#FFFFFF] rounded-12 border border-border/30 shadow-md w-96 space-y-4'
                    floatingChildren={
                        <>
                            <div className='flex justify-between items-baseline'>
                                <h3 className='font-semibold text-lg'>
                                    Giỏ hàng
                                </h3>
                                <h4>10 sản phẩm</h4>
                            </div>
                            <SimpleBar
                                style={{ maxHeight: 210, paddingRight: 20 }}
                            >
                                <ul className='space-y-3'>
                                    <li className='flex gap-x-3'>
                                        <Link
                                            to={'/'}
                                            className='flex-shrink-0'
                                        >
                                            <img
                                                src='https://down-vn.img.susercontent.com/file/6d5ad8d0713d2109f35efd5131f46999_tn'
                                                alt='cart-img'
                                                className='w-12 h-12 rounded-6 shadow-sm flex-shrink-0'
                                            />
                                        </Link>
                                        <Link
                                            to={'/'}
                                            className='line-clamp-2 tracking-wide leading-4'
                                        >
                                            Kê tay bàn phím Kê tay bàn phím Kê
                                            tay bàn phím
                                        </Link>
                                        <h4 className='ml-auto w-fit text-red-700'>
                                            80.000đ
                                        </h4>
                                    </li>
                                    <li className='flex gap-x-3'>
                                        <Link
                                            to={'/'}
                                            className='flex-shrink-0'
                                        >
                                            <img
                                                src='https://down-vn.img.susercontent.com/file/6d5ad8d0713d2109f35efd5131f46999_tn'
                                                alt='cart-img'
                                                className='w-12 h-12 rounded-6 shadow-sm flex-shrink-0'
                                            />
                                        </Link>
                                        <Link
                                            to={'/'}
                                            className='line-clamp-2 tracking-wide leading-4'
                                        >
                                            Kê tay bàn phím Kê tay bàn phím Kê
                                            tay bàn phím
                                        </Link>
                                        <h4 className='ml-auto w-fit text-red-700'>
                                            80.000đ
                                        </h4>
                                    </li>
                                    <li className='flex gap-x-3'>
                                        <Link
                                            to={'/'}
                                            className='flex-shrink-0'
                                        >
                                            <img
                                                src='https://down-vn.img.susercontent.com/file/6d5ad8d0713d2109f35efd5131f46999_tn'
                                                alt='cart-img'
                                                className='w-12 h-12 rounded-6 shadow-sm flex-shrink-0'
                                            />
                                        </Link>
                                        <Link
                                            to={'/'}
                                            className='line-clamp-2 tracking-wide leading-4'
                                        >
                                            Kê tay bàn phím Kê tay bàn phím Kê
                                            tay bàn phím
                                        </Link>
                                        <h4 className='ml-auto w-fit text-red-700'>
                                            80.000đ
                                        </h4>
                                    </li>
                                    <li className='flex gap-x-3'>
                                        <Link
                                            to={'/'}
                                            className='flex-shrink-0'
                                        >
                                            <img
                                                src='https://down-vn.img.susercontent.com/file/6d5ad8d0713d2109f35efd5131f46999_tn'
                                                alt='cart-img'
                                                className='w-12 h-12 rounded-6 shadow-sm flex-shrink-0'
                                            />
                                        </Link>
                                        <Link
                                            to={'/'}
                                            className='line-clamp-2 tracking-wide leading-4'
                                        >
                                            Kê tay bàn phím Kê tay bàn phím Kê
                                            tay bàn phím
                                        </Link>
                                        <h4 className='ml-auto w-fit text-red-700'>
                                            80.000đ
                                        </h4>
                                    </li>
                                    <li className='flex gap-x-3'>
                                        <Link
                                            to={'/'}
                                            className='flex-shrink-0'
                                        >
                                            <img
                                                src='https://down-vn.img.susercontent.com/file/6d5ad8d0713d2109f35efd5131f46999_tn'
                                                alt='cart-img'
                                                className='w-12 h-12 rounded-6 shadow-sm flex-shrink-0'
                                            />
                                        </Link>
                                        <Link
                                            to={'/'}
                                            className='line-clamp-2 tracking-wide leading-4'
                                        >
                                            Kê tay bàn phím Kê tay bàn phím Kê
                                            tay bàn phím
                                        </Link>
                                        <h4 className='ml-auto w-fit text-red-700'>
                                            80.000đ
                                        </h4>
                                    </li>
                                </ul>
                            </SimpleBar>
                            <div className='text-right'>
                                <Button
                                    text='Đặt hàng'
                                    className='w-full py-[10px] text-xs'
                                />
                            </div>
                        </>
                    }
                />
                <Popover
                    referenceChildren={
                        <img
                            src='https://cdn-icons-png.flaticon.com/512/2202/2202112.png'
                            alt='background'
                            className='object-cover'
                        />
                    }
                    referenceClassName='rounded-full w-[40px] h-[40px]'
                    floatingClassName='p-12 rounded-8 bg-[#FFFFFF] border border-border/30 flex flex-col shadow-md'
                    floatingChildren={
                        <>
                            <Link
                                to={'/'}
                                className='p-12 rounded-6 hover:bg-gray-200'
                            >
                                Thông tin cá nhân
                            </Link>
                            <button className='p-12 rounded-6 hover:bg-gray-200 w-full text-left'>
                                Đăng xuất
                            </button>
                        </>
                    }
                />
            </section>
        </header>
    )
}

export default Header
