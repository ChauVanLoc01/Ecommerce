import Accordion from '../Accordion'
import { LuNewspaper } from 'react-icons/lu'
import { BsShop } from 'react-icons/bs'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Path } from 'src/constants/path.enum'
import { orderStatus } from 'src/constants/orderStatus.enum'
import { productStatus } from 'src/constants/productStatus.enum'

type SidebarProps = {
  rootClassName?: string
}

function Sidebar({ rootClassName }: SidebarProps) {
  const { pathname, search } = useLocation()
  return (
    <div className={`py-5 space-y-3 ${rootClassName} lg:px-2 xl:px-3 h-screen bg-white`}>
      <Accordion
        icon={<BsShop />}
        title='Quản lý Shop'
        isActive={([Path.profile] as string[]).includes(pathname.split('/')[1]) || Path.main === pathname}
        content={
          <>
            <NavLink to={Path.main} className={({ isActive }) => `hover:text-primary ${isActive && 'text-primary'}`}>
              Tổng quan
            </NavLink>
            <NavLink to={Path.profile} className={({ isActive }) => `hover:text-primary ${isActive && 'text-primary'}`}>
              Hồ sơ
            </NavLink>
            <NavLink to={'analytics'} className={({ isActive }) => `hover:text-primary ${isActive && 'text-primary'}`}>
              Phân tích bán hàng
            </NavLink>
          </>
        }
        duration={0.26}
      />
      <Accordion
        icon={<LuNewspaper />}
        title='Quản lý đơn hàng'
        isActive={([Path.order] as string[]).includes(pathname.split('/')[1])}
        content={
          <>
            <NavLink
              to={Path.order}
              className={({ isActive }) => `hover:text-primary ${isActive && !search && 'text-primary'}`}
            >
              Tất cả
            </NavLink>
            <NavLink
              to={{
                pathname: Path.order,
                search: `status=${orderStatus.confirm}`
              }}
              className={({ isActive }) =>
                `hover:text-primary ${isActive && search.endsWith(orderStatus.confirm) && 'text-primary'}`
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
                `hover:text-primary ${isActive && search.endsWith(orderStatus.waitingShiper) && 'text-primary'}`
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
                `hover:text-primary ${isActive && search.endsWith(orderStatus.success) && 'text-primary'}`
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
                `hover:text-primary ${isActive && search.endsWith(orderStatus.cancel) && 'text-primary'}`
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
                `hover:text-primary ${isActive && search.endsWith(orderStatus.refund) && 'text-primary'}`
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
        isActive={([Path.product] as string[]).includes(pathname.split('/')[1])}
        content={
          <>
            <NavLink
              to={Path.product}
              className={({ isActive }) => `hover:text-primary ${isActive && !search && 'text-primary'}`}
            >
              Tất cả sản phẩm
            </NavLink>
            <NavLink
              to={{
                pathname: Path.product,
                search: `status=${productStatus.new}`
              }}
              className={({ isActive }) =>
                `hover:text-primary ${isActive && search.endsWith(productStatus.new) && 'text-primary'}`
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
                `hover:text-primary ${isActive && search.endsWith(productStatus.best_seller) && 'text-primary'}`
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
                `hover:text-primary ${isActive && search.endsWith(productStatus.sold_out) && 'text-primary'}`
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
