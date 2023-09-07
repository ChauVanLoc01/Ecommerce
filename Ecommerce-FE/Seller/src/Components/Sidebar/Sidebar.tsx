import Accordion from '../Accordion'
import { LuNewspaper } from 'react-icons/lu'
import { LiaTruckSolid } from 'react-icons/lia'
import { BsShop } from 'react-icons/bs'
import { AiOutlineShoppingCart } from 'react-icons/ai'

function Sidebar() {
  return (
    <div className='py-5 space-y-3 border-r border-gray-100 bg-white h-screen'>
      <Accordion
        icon={<BsShop />}
        title='Quản lý Shop'
        content={
          <>
            <button className='hover:text-primary'>Hồ sơ</button>
            <button className='hover:text-primary'>Danh mục</button>
            <button className='hover:text-primary'>Đánh giá</button>
            <button className='hover:text-primary'>Phân tích bán hàng</button>
          </>
        }
        duration={0.26}
      />
      <Accordion
        icon={<LuNewspaper />}
        title='Quản lý đơn hàng'
        content={
          <>
            <button className='hover:text-primary'>Tất cả</button>
            <button className='hover:text-primary'>Đơn hủy</button>
            <button className='hover:text-primary'>Trả hàng / Hoàn tiền</button>
          </>
        }
      />
      <Accordion
        icon={<AiOutlineShoppingCart />}
        title='Quản lý sản phẩm'
        content={
          <>
            <button className='hover:text-primary'>Tất cả sản phẩm</button>
            <button className='hover:text-primary'>Thêm sản phẩm</button>
            <button className='hover:text-primary'>Cài đặt sản phẩm</button>
          </>
        }
      />
      <Accordion
        icon={<LiaTruckSolid />}
        title='Vận chuyển'
        content={
          <>
            <button>Quản lý vận chuyển</button>
            <button>Giao Hàng Loạt</button>
            <button>Cài đặt vận chuyển</button>
          </>
        }
      />
    </div>
  )
}

export default Sidebar
