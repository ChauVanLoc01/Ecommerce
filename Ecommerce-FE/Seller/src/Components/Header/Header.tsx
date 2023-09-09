import { Link } from 'react-router-dom'
import { PiDotsNineBold, PiUserCircleThin, PiStorefrontLight } from 'react-icons/pi'
import { FaOpencart } from 'react-icons/fa'
import { CiBellOn } from 'react-icons/ci'
import Icon from '../Icon'
import Popover from '../Popover'
import { LiaGiftSolid } from 'react-icons/lia'
import { BsListUl } from 'react-icons/bs'
import Notification from '../Notification'

function Header() {
  return (
    <div className='flex justify-between items-center border-b-2 border-gray-100 xl:px-4 lg:px-3 py-2 shadow-sm bg-white'>
      <div className='space-x-2 flex items-center'>
        <Link to='/' className='flex items-center space-x-2'>
          <Icon icon={<FaOpencart />} size='50px' color='#fa541c' />
          <span className='text-2xl font-semibold font-serif text-[#fa541c]'>Eco</span>
        </Link>
        <span>Kênh Người Bán</span>
      </div>
      <div className='flex items-center space-x-4'>
        <Popover
          refChild={
            <>
              <Icon icon={<PiUserCircleThin />} size='35px' />
              <span>Chau Van Loc</span>
            </>
          }
          refClassName='flex space-x-1 items-center'
          floatingChild={
            <>
              <button className='pl-2 rounded-md pr-12 py-1 hover:bg-gray-100'>Hồ sơ Shop</button>
              <button className='rounded-md pr-12 py-1 hover:bg-gray-100 w-full'>Đăng xuất</button>
            </>
          }
          floatingClassName='flex flex-col items-start border border-gray-200 rounded-md shadow-md bg-white p-2'
          hasArrow={true}
          arrowClassName='w-3 h-3'
          arrowStrokeColor='#f0f0f0'
          arrowStrokeWidth={1}
          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
          animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
          transition={{ duration: 0.2 }}
        />
        <div className='flex items-center space-x-4'>
          <div>
            <Popover
              refChild={<Icon icon={<PiDotsNineBold />} />}
              floatingChild={
                <>
                  <button className='flex flex-col items-center group space-y-1'>
                    <span className='rounded-full bg-gradient-to-tr from-violet-600 to-violet-300 w-8 h-8 flex justify-center items-center group-hover:-translate-y-1'>
                      <Icon icon={<LiaGiftSolid />} color='white' size='20px' />
                    </span>
                    <span>Sản phẩm</span>
                  </button>
                  <button className='flex flex-col items-center group space-y-1'>
                    <span className='rounded-full bg-gradient-to-tr from-green-600 to-green-300 w-8 h-8 flex justify-center items-center group-hover:-translate-y-1'>
                      <Icon icon={<BsListUl />} color='white' size='20px' />
                    </span>
                    <span>Danh mục</span>
                  </button>
                  <button className='flex flex-col items-center group space-y-1'>
                    <span className='rounded-full bg-gradient-to-tr from-red-600 to-red-300 w-8 h-8 flex justify-center items-center group-hover:-translate-y-1'>
                      <Icon icon={<PiStorefrontLight />} color='white' size='20px' />
                    </span>
                    <span>Đơn hàng</span>
                  </button>
                  <button className='flex flex-col items-center group space-y-1'>
                    <span className='rounded-full bg-gradient-to-tr from-cyan-600 to-cyan-300 w-8 h-8 flex justify-center items-center group-hover:-translate-y-1'>
                      <Icon icon={<LiaGiftSolid />} color='white' size='20px' />
                    </span>
                    <span>Danh thu</span>
                  </button>
                </>
              }
              floatingClassName='grid grid-cols-2 bg-white shadow-md border-gray-100 border p-3 rounded-md gap-3 text-xs text-gray-500'
              hasArrow={true}
              arrowClassName='w-3 h-3 fill-white'
              arrowStrokeColor='#f0f0f0'
              arrowStrokeWidth={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div>
            <Popover
              refChild={
                <>
                  <Icon icon={<CiBellOn />} />
                  <span className='rounded-lg absolute -top-1 -right-1 text-[11px] bg-red-500 text-white w-4 h-4 flex items-center justify-center'>
                    9+
                  </span>
                </>
              }
              refClassName='relative'
              floatingChild={
                <>
                  <div className='flex justify-between text-[10px] border-b border-gray-200 pb-2 p-3'>
                    <span>Thông báo đã nhận gần đây</span>
                    <button className='text-red-500'>Đánh dấu đã đọc tất cả</button>
                  </div>
                  <div className='p-3 space-y-3 max-h-72 overflow-y-scroll'>
                    <Notification
                      rootClass='gap-x-2'
                      imgClass='w-8 h-8 object-cover shrink-0'
                      titleClass='text-[11px]'
                      footerClass='text-[10px] text-gray-400'
                    />
                    <Notification
                      rootClass='gap-x-2'
                      imgClass='w-8 h-8 object-cover shrink-0'
                      titleClass='text-[11px]'
                      footerClass='text-[10px] text-gray-400'
                    />
                    <Notification
                      rootClass='gap-x-2'
                      imgClass='w-8 h-8 object-cover shrink-0'
                      titleClass='text-[11px]'
                      footerClass='text-[10px] text-gray-400'
                    />
                    <Notification
                      rootClass='gap-x-2'
                      imgClass='w-8 h-8 object-cover shrink-0'
                      titleClass='text-[11px]'
                      footerClass='text-[10px] text-gray-400'
                    />
                    <Notification
                      rootClass='gap-x-2'
                      imgClass='w-8 h-8 object-cover shrink-0'
                      titleClass='text-[11px]'
                      footerClass='text-[10px] text-gray-400'
                    />
                  </div>
                  <div className='text-center text-[10px] py-2 border-t border-gray-100 text-blue-500'>
                    <button>Xem tất cả thông báo</button>
                  </div>
                </>
              }
              floatingClassName='bg-white shadow-md border border-gray-100 rounded-md max-w-[300px]'
              hasArrow={true}
              arrowClassName='w-3 h-3 fill-white'
              arrowStrokeColor='#f0f0f0'
              arrowStrokeWidth={1}
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div>
            <button className='py-1 px-3 rounded-full border border-gray-400'>SHOPEE UNI</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
