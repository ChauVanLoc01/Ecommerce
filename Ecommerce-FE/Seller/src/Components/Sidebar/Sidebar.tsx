import { AiOutlineShoppingCart } from 'react-icons/ai'
import { BsShop } from 'react-icons/bs'
import { LuNewspaper } from 'react-icons/lu'
import { NavLink, useLocation } from 'react-router-dom'

import { orderStatus } from 'src/constants/orderStatus.enum'
import { Path } from 'src/constants/path.enum'
import { productStatus } from 'src/constants/productStatus.enum'

import Accordion from '../Accordion'

type SidebarProps = {
    rootClassName?: string
}

function Sidebar({ rootClassName }: SidebarProps) {
    const { pathname, search } = useLocation()
    return (
        <div
            className={`py-6 space-y-4 ${rootClassName} h-screen bg-white px-5 border-r border-gray-200`}
        >
            <Accordion
                icon={<BsShop />}
                title='Quản lý Shop'
                isActive={
                    ([Path.profile] as string[]).includes(
                        pathname.split('/')[1]
                    ) || Path.main === pathname
                }
                content={
                    <>
                        <NavLink
                            to={Path.main}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive && 'text-primary'
                                }`
                            }
                        >
                            Tổng quan
                        </NavLink>
                        <NavLink
                            to={Path.profile}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive && 'text-primary'
                                }`
                            }
                        >
                            Hồ sơ
                        </NavLink>
                        <NavLink
                            to={'analytics'}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive && 'text-primary'
                                }`
                            }
                        >
                            Phân tích bán hàng
                        </NavLink>
                        <NavLink
                            to={Path.reviews}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive && 'text-primary'
                                }`
                            }
                        >
                            Đánh giá khách hàng
                        </NavLink>
                    </>
                }
                childrenLength={3}
            />
            <Accordion
                icon={<LuNewspaper />}
                title='Quản lý đơn hàng'
                isActive={([Path.order] as string[]).includes(
                    pathname.split('/')[1]
                )}
                childrenLength={6}
                content={
                    <>
                        <NavLink
                            to={Path.order}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive && !search && 'text-primary'
                                }`
                            }
                        >
                            Tất cả
                        </NavLink>
                        <NavLink
                            to={{
                                pathname: Path.order,
                                search: `status=${orderStatus.confirm}`
                            }}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive &&
                                    search.endsWith(orderStatus.confirm) &&
                                    'text-primary'
                                }`
                            }
                        >
                            Chờ xác nhận
                        </NavLink>
                        <NavLink
                            to={{
                                pathname: Path.order,
                                search: `status=${orderStatus.waitingShiper}`
                            }}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive &&
                                    search.endsWith(
                                        orderStatus.waitingShiper
                                    ) &&
                                    'text-primary'
                                }`
                            }
                        >
                            Chờ shiper nhận hàng
                        </NavLink>
                        <NavLink
                            to={{
                                pathname: Path.order,
                                search: `status=${orderStatus.success}`
                            }}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive &&
                                    search.endsWith(orderStatus.success) &&
                                    'text-primary'
                                }`
                            }
                        >
                            Thành công
                        </NavLink>
                        <NavLink
                            to={{
                                pathname: Path.order,
                                search: `status=${orderStatus.cancel}`
                            }}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive &&
                                    search.endsWith(orderStatus.cancel) &&
                                    'text-primary'
                                }`
                            }
                        >
                            Đơn hủy
                        </NavLink>
                        <NavLink
                            to={{
                                pathname: Path.order,
                                search: `status=${orderStatus.refund}`
                            }}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive &&
                                    search.endsWith(orderStatus.refund) &&
                                    'text-primary'
                                }`
                            }
                        >
                            Trả hàng / Hoàn tiền
                        </NavLink>
                    </>
                }
            />
            <Accordion
                icon={<AiOutlineShoppingCart />}
                title='Quản lý sản phẩm'
                isActive={([Path.product] as string[]).includes(
                    pathname.split('/')[1]
                )}
                childrenLength={4}
                content={
                    <>
                        <NavLink
                            to={Path.product}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive && !search && 'text-primary'
                                }`
                            }
                        >
                            Tất cả sản phẩm
                        </NavLink>
                        <NavLink
                            to={{
                                pathname: Path.product,
                                search: `status=${productStatus.new}`
                            }}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive &&
                                    search.endsWith(productStatus.new) &&
                                    'text-primary'
                                }`
                            }
                        >
                            Sản phẩm mới
                        </NavLink>
                        <NavLink
                            to={{
                                pathname: Path.product,
                                search: `status=${productStatus.best_seller}`
                            }}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive &&
                                    search.endsWith(
                                        productStatus.best_seller
                                    ) &&
                                    'text-primary'
                                }`
                            }
                        >
                            Bán chạy nhất
                        </NavLink>
                        <NavLink
                            to={{
                                pathname: Path.product,
                                search: `status=${productStatus.sold_out}`
                            }}
                            className={({ isActive }) =>
                                `hover:text-primary ${
                                    isActive &&
                                    search.endsWith(productStatus.sold_out) &&
                                    'text-primary'
                                }`
                            }
                        >
                            Hết hàng
                        </NavLink>
                    </>
                }
            />
        </div>
    )
}

export default Sidebar
