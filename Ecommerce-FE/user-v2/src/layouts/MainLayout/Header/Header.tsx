import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useContext } from 'react'
import { PiShoppingCartLight } from 'react-icons/pi'
import { Link, useNavigate } from 'react-router-dom'
import SimpleBar from 'simplebar-react'

import Button from 'src/components/Button'
import Image from 'src/components/Image'
import Popover from 'src/components/Popover'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

const Header = () => {
    const { products } = useContext(AppContext)
    const navigate = useNavigate()

    const handleNavigate = (setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, path?: string) => () => {
        setIsOpen(false)
        path && navigate(path)
    }

    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className='pt-3 pb-5 flex items-center justify-between'
        >
            <Link to={route.root}>
                <img
                    src='https://cdn-icons-png.flaticon.com/128/4151/4151729.png'
                    alt='logo-img'
                    className='w-14 h-1w-14 object-cover'
                />
            </Link>
            <section className='flex items-center justify-end space-x-2'>
                <Popover
                    referenceChildren={
                        <div className='relative'>
                            <PiShoppingCartLight size={27} />
                            <span
                                className={classNames(
                                    'absolute -top-1 -right-1 inline-block p-1 rounded-full bg-red-500 text-[11px] text-white',
                                    {
                                        'px-1.5': products.length < 9
                                    }
                                )}
                            >
                                {products.length < 9 ? products.length : '9+'}
                            </span>
                        </div>
                    }
                    referenceClassName='p-8 hover:bg-gray-200 rounded-8'
                    data-length={products.length}
                    floatingClassName='p-[24px] bg-[#FFFFFF] rounded-12 border border-border/30 shadow-md w-96 space-y-4'
                    floatingChildren={({ setIsOpen }) => (
                        <>
                            <div className='flex justify-between items-baseline'>
                                <h3 className='font-semibold text-lg'>Giỏ hàng</h3>
                                <h4>{products.length} sản phẩm</h4>
                            </div>
                            {!products.length ? (
                                <>
                                    <div className='w-1/2 mx-auto'>
                                        <img
                                            className='object-cover'
                                            src='https://cdn-icons-png.flaticon.com/512/13637/13637462.png'
                                            alt='cart-empty'
                                        />
                                    </div>
                                    <div className='text-right'></div>
                                    <Button
                                        text='Tiếp tục mua sắm'
                                        className='w-full py-[10px] text-xs'
                                        onClick={handleNavigate(setIsOpen)}
                                    />
                                </>
                            ) : (
                                <>
                                    <SimpleBar style={{ maxHeight: 210, paddingRight: 20 }}>
                                        <ul className='space-y-3'>
                                            {products.map((e) => (
                                                <li className='flex gap-x-3'>
                                                    <button
                                                        className='flex-shrink-0'
                                                        onClick={handleNavigate(
                                                            setIsOpen,
                                                            `/${removeSpecialCharacter(e.name)}-0-${e.id}`
                                                        )}
                                                    >
                                                        <Image
                                                            src={e.image}
                                                            alt='cart-img'
                                                            className='w-12 h-12 rounded-6 shadow-sm flex-shrink-0'
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={handleNavigate(
                                                            setIsOpen,
                                                            `/${removeSpecialCharacter(e.name)}-0-${e.id}`
                                                        )}
                                                        className='tracking-wide leading-4 text-left flex flex-col justify-start'
                                                    >
                                                        <span className='line-clamp-2'>{e.name}</span>
                                                        <span className='text-red-500 text-xs'>
                                                            {convertCurrentcy(e.priceAfter || 0, 0)}đ x {e.buy}
                                                        </span>
                                                    </button>
                                                    <h4 className='ml-auto w-fit text-red-700'>
                                                        {convertCurrentcy(e.priceAfter * e.buy || 0, 0)}đ
                                                    </h4>
                                                </li>
                                            ))}
                                        </ul>
                                    </SimpleBar>
                                    <div className='text-right'>
                                        <Button
                                            text='Đặt hàng'
                                            className='w-full py-[10px] text-xs'
                                            onClick={handleNavigate(setIsOpen, `${route.root}${route.checkout}`)}
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}
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
                    floatingChildren={({ setIsOpen }) => (
                        <>
                            <button
                                className='p-12 rounded-6 hover:bg-gray-200'
                                onClick={handleNavigate(setIsOpen, `/${route.profile}`)}
                            >
                                Thông tin cá nhân
                            </button>
                            <button
                                className='p-12 rounded-6 hover:bg-gray-200'
                                onClick={handleNavigate(setIsOpen, `/${route.profile}/${route.order}`)}
                            >
                                Đơn hàng đã mua
                            </button>
                            <button
                                onClick={handleNavigate(setIsOpen)}
                                className='p-12 rounded-6 hover:bg-gray-200 w-full text-left'
                            >
                                Đăng xuất
                            </button>
                        </>
                    )}
                />
            </section>
        </motion.header>
    )
}

export default Header
