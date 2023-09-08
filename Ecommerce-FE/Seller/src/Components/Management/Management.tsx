import { AiOutlineLine } from 'react-icons/ai'
import { GoSearch } from 'react-icons/go'
import { DatePicker } from 'antd'
import Icon from '../Icon'
import Select from '../Select'
import { useState } from 'react'
const { RangePicker } = DatePicker

function Management() {
  const [choosed, setChoosed] = useState<string | undefined>(undefined)
  return (
    <div className='p-2'>
      <div className='bg-white rounded-xs space-y-3 text-xs'>
        <div className='flex border-b border-gray-200 px-2'>
          <button className='xl:px-4 md:px-3 py-3'>Tất cả</button>
          <button className='xl:px-4 md:px-3 py-3'>Chờ xác nhận</button>
          <button className='xl:px-4 md:px-3 py-3'>Chờ lấy hàng</button>
          <button className='xl:px-4 md:px-3 py-3'>Đang giao</button>
          <button className='xl:px-4 md:px-3 py-3'>Đã giao</button>
          <button className='xl:px-4 md:px-3 py-3'>Đơn hủy</button>
          <button className='xl:px-4 md:px-3 py-3'>Trả hàng/Hoàn tiền</button>
        </div>
        <div className='flex justify-end space-x-5 items-center px-2'>
          <span>Ngày đặt hàng:</span>
          <RangePicker
            format={'DD-MM-YYYY'}
            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            separator={<Icon icon={<AiOutlineLine />} size='10px' color='#bfbfbf' />}
            className='rounded-xs border-gray-200 hover:border-gray-400'
          />
          <div>
            <button className='px-3 py-1 border border-gray-400 rounded-xs'>Xuất</button>
          </div>
        </div>
        <div className='px-2 flex items-center justify-between'>
          <div className='flex xl:basis-10/12 md:basis-3/4'>
            <div className='basis-3/12'>
              <Select
                title='Mã đơn hàng'
                data={['Mã đơn hàng', 'Tên người mua', 'Sản phẩm', 'Mã vận đơn', 'Mã yêu cầu trả hàng']}
                refClassName='py-[6px] px-2 rounded-none rounded-l-xs border-gray-200'
                itemInFloatingClassname='px-2 py-1 rounded-none'
                setChoosed={setChoosed}
                defaultValue={1}
              />
            </div>
            <div className='border rounded-r-xs border-gray-200 basis-9/12 flex items-center relative hover:border-gray-400'>
              <input
                className='outline-none w-full px-3 pr-8'
                type='text'
                name='search'
                id='search'
                placeholder={`Nhập ${choosed ? choosed.toLowerCase() : '...'}`}
              />
              <Icon icon={<GoSearch />} className='absolute right-2 top-1/2 -translate-y-1/2' size='16px' />
            </div>
          </div>
          <div>
            <button className='px-3 py-1 bg-primary text-white hover:bg-primary/90 rounded-xs'>Tìm kiếm</button>
          </div>
          <div>
            <button className='px-3 py-1 hover:bg-gray-100 rounded-xs border border-gray-200'>Đặt lại</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Management
