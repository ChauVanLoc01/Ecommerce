import Accordion from '../Accordion'
import { LuNewspaper } from 'react-icons/lu'
import { LiaTruckSolid } from 'react-icons/lia'
import { BsShop } from 'react-icons/bs'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { Link } from 'react-router-dom'

type SidebarProps = {
  rootClassName?: string
}

function Sidebar({ rootClassName }: SidebarProps) {
  return (
    <div className={`py-5 space-y-3 border-r border-gray-100 bg-white h-screen ${rootClassName} lg:px-2 xl:px-3`}>
      <Accordion
        icon={<BsShop />}
        title='Quản lý Shop'
        content={
          <>
            <Link to={'/'} className='hover:text-primary'>
              Tổng quan
            </Link>
            <Link to={'/'} className='hover:text-primary'>
              Hồ sơ
            </Link>
            <Link to={'/'} className='hover:text-primary'>
              Danh mục
            </Link>
            <Link to={'/'} className='hover:text-primary'>
              Đánh giá
            </Link>
            <Link to={'/'} className='hover:text-primary'>
              Phân tích bán hàng
            </Link>
          </>
        }
        duration={0.26}
      />
      <Accordion
        icon={<LuNewspaper />}
        title='Quản lý đơn hàng'
        content={
          <>
            <Link to={'/'} className='hover:text-primary'>
              Tất cả
            </Link>
            <Link to={'/'} className='hover:text-primary'>
              Đơn hủy
            </Link>
            <Link to={'/'} className='hover:text-primary'>
              Trả hàng / Hoàn tiền
            </Link>
          </>
        }
      />
      <Accordion
        icon={<AiOutlineShoppingCart />}
        title='Quản lý sản phẩm'
        content={
          <>
            <Link to={'/'} className='hover:text-primary'>
              Tất cả sản phẩm
            </Link>
            <Link to={'/'} className='hover:text-primary'>
              Thêm sản phẩm
            </Link>
            <Link to={'/'} className='hover:text-primary'>
              Cài đặt sản phẩm
            </Link>
          </>
        }
      />
      <Accordion
        icon={<LiaTruckSolid />}
        title='Vận chuyển'
        content={
          <>
            <Link to={'/'} className='hover:text-primary'>
              Quản lý vận chuyển
            </Link>
            <Link to={'/'} className='hover:text-primary'>
              Giao Hàng Loạt
            </Link>
            <Link to={'/'} className='hover:text-primary'>
              Cài đặt vận chuyển
            </Link>
          </>
        }
      />
    </div>
  )
}

export default Sidebar
