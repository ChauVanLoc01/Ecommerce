import { Link, useLocation } from 'react-router-dom'

function HeaderRegister() {
  const location = useLocation()
  return (
    <header className='py-5'>
      <div className='mx-auto max-w-7xl px-4'>
        <nav className='flex items-end'>
          <Link to={'/'} className='flex items-end text-primary'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-10 lg:w-10 xl:h-12 xl:w-12'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
              />
            </svg>
            <label className='ml-2 cursor-pointer font-serif text-2xl xl:text-3xl'>
              TechShop
            </label>
          </Link>
          <div className='ml-5 text-xl lg:text-2xl'>
            {location.pathname.includes('login') ? 'Đăng nhập' : 'Đăng ký'}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default HeaderRegister
