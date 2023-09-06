import { Link } from 'react-router-dom'
import { PiDotsNineBold, PiUserCircleThin } from 'react-icons/pi'
import { FaOpencart } from 'react-icons/fa'
import { CiBellOn } from 'react-icons/ci'
import Icon from '../Icon'
import Popover from '../Popover'
import { motion, AnimatePresence } from 'framer-motion'

function Header() {
  return (
    <div className='flex justify-between items-center border-b-2 border-gray-100 p-2 shadow-sm'>
      <Link to='/' className='space-x-2 flex items-center'>
        <Icon icon={<FaOpencart />} size='50px' color='#fa541c' />
        <span className='text-2xl font-semibold font-serif text-[#fa541c]'>Eco</span>
        <span>Kênh Người Bán</span>
      </Link>
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
          arrowClassName='w-3 h-3 fill-white'
          arrowStrokeColor='#f0f0f0'
          arrowStrokeWidth={1}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.14 }}
        />
        <div className='flex items-center space-x-4'>
          <div>
            <button>
              <Icon icon={<PiDotsNineBold />} />
            </button>
          </div>
          <div>
            <button className='relative'>
              <Icon icon={<CiBellOn />} />
              <span className='rounded-lg absolute -top-1 -right-1 text-[11px] bg-red-500 text-white w-4 h-4 flex items-center justify-center'>
                9+
              </span>
            </button>
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
