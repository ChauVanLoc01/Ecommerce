import { useContext } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Context } from 'src/context/AppContext'
import Popover from '../Popover'
import { AuthFetching } from 'src/Api/AthFetching'
import { useForm } from 'react-hook-form'
import useSearchUrl from 'src/hooks/useSearchUrl'
import { convertCurrentcy, initId, joinKeySearch } from 'src/utils/utils'
import { ProductSearch } from 'src/constants/KeySearch'
import omit from 'lodash/omit'
import Badge from 'antd/lib/badge'
import Empty from 'antd/lib/empty'
import useQueryListPurchase from 'src/hooks/useQueryListPurchase'
import { PathRoute } from 'src/constants/PathRoute'
import { UserFetching } from 'src/Api/UserFetching'
import { urlApi } from 'src/constants/config'
import classNames from 'classnames'

const { user: userPath, account, profile, order, password } = PathRoute

function Header() {
  const o = useSearchUrl()
  const location = useLocation()
  const join = joinKeySearch<ProductSearch>(omit(o, ['category']))
  const { isAuth, setIsAuth, user, setUser } = useContext(Context)
  const navigate = useNavigate()
  const LogoutMutation = useMutation({
    mutationFn: () => AuthFetching.LogoutFetching(),
    onSuccess() {
      setUser(null)
      setIsAuth(false)
    }
  })
  const getUserFetching = useQuery({
    queryKey: ['user'],
    queryFn: UserFetching.GetUserFetching,
    enabled: isAuth
  })
  const avatar = getUserFetching.data?.data.data.avatar
  const purchaseFetching = useQueryListPurchase(isAuth)

  const { handleSubmit, reset, register } = useForm<{
    search: string
  }>()
  const LogoutHandle = () => {
    LogoutMutation.mutate()
  }
  const onSubmit = handleSubmit((data) => {
    if (data.search) {
      navigate(`${join({ name: data.search })}`)
      reset()
    }
  })
  const purchaseData = purchaseFetching.data?.data.data
  return (
    <div className='bg-header px-2 pb-2 pt-1 md:px-3 md:pb-3 lg:px-0 lg:pb-4 xl:px-0 xl:pb-5'>
      <div className='mx-auto text-[10px] text-white md:max-w-3xl lg:max-w-4xl xl:max-w-7xl xl:text-xs'>
        <div className='mb:mb-2 mb-1 mt-1 flex justify-end md:justify-between lg:mb-2 lg:justify-between xl:mb-3 xl:justify-between'>
          <div className='hidden items-center justify-between sm:hidden md:flex md:space-x-2 lg:flex lg:space-x-3 xl:flex xl:space-x-4'>
            <span className={'border-r-[1px] md:pr-2 lg:pr-2 xl:pr-3'}>
              Kênh Người Bán
            </span>
            <span className={'border-r-[1px] md:pr-2 lg:pr-2 xl:pr-3'}>
              Trở thành Người bán
            </span>
            <span className={'border-r-[1px] md:pr-2 lg:pr-2 xl:block xl:pr-3'}>
              Tải ứng dụng
            </span>
            <span>Kết nối</span>
          </div>
          <div className='flex flex-shrink-0 items-center space-x-5 lg:space-x-3 xl:space-x-4'>
            <span
              className={
                'hidden items-center justify-center lg:flex lg:flex-row xl:flex xl:flex-row'
              }
            >
              <span className='mr-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
                  />
                </svg>
              </span>
              Thông Báo
            </span>
            <span
              className={
                'hidden justify-center sm:hidden md:hidden lg:flex lg:flex-row lg:items-center xl:flex xl:flex-row xl:items-center'
              }
            >
              <span className='mr-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
                  />
                </svg>
              </span>
              Hỗ Trợ
            </span>
            <Popover
              as={<span>Ngôn ngữ</span>}
              classNameBlock='py-1 cursor-pointer'
              classNameArrow='translate-l-[-50%] absolute top-[-16%] border-[6px] border-solid border-white border-x-transparent border-t-transparent'
            >
              <div
                className={
                  'flex flex-col rounded-sm bg-white py-3 pl-3 pr-16 text-[12px] text-gray-800 shadow-md'
                }
              >
                <button className='mb-3 hover:text-header'>Tiếng Việt</button>
                <button className='hover:text-header'>Tiếng Anh</button>
              </div>
            </Popover>
            {isAuth ? (
              <Popover
                as={
                  <div className='flex'>
                    {avatar ? (
                      <img
                        className='mr-2 h-[15px] w-[15px] rounded-full object-cover'
                        src={avatar ? `${urlApi}images/${avatar}` : ''}
                        alt='avatar'
                      />
                    ) : (
                      <svg
                        className='mr-2 h-[15px] w-[15px] rounded-full bg-white stroke-[#c6c6c6]'
                        enableBackground='new 0 0 15 15'
                        viewBox='0 0 15 15'
                        x={0}
                        y={0}
                      >
                        <g>
                          <circle
                            cx='7.5'
                            cy='4.5'
                            fill='none'
                            r='3.8'
                            strokeMiterlimit={10}
                          />
                          <path
                            d='m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6'
                            fill='none'
                            strokeLinecap='round'
                            strokeMiterlimit={10}
                          />
                        </g>
                      </svg>
                    )}
                    <span>{user?.name ? user.name : user?.email}</span>
                  </div>
                }
                off={0.7}
                classNameBlock='pl-3 py-1 cursor-pointer'
                classNameArrow={`translate-l-[-50%] absolute -top-[8.2%] md:-top-[11%] border-[6px] border-solid border-white border-x-transparent border-t-transparent`}
              >
                <div className='flex flex-col rounded-sm bg-white text-[12px] shadow-sm'>
                  <NavLink
                    to={`/${userPath}/${account}/${profile}`}
                    className='hidden cursor-pointer py-[9px] pl-5 pr-16 capitalize hover:bg-gray-100 hover:text-primary md:block'
                  >
                    Tài khoản của tôi
                  </NavLink>
                  <NavLink
                    to={`/${userPath}/${account}/${profile}`}
                    className='block cursor-pointer py-[9px] pl-5 pr-16 capitalize hover:bg-gray-100 hover:text-primary md:hidden'
                  >
                    Hồ sơ của tôi
                  </NavLink>
                  <NavLink
                    to={`/${userPath}/${account}/${password}`}
                    className='block cursor-pointer py-[9px] pl-5 pr-16 capitalize hover:bg-gray-100 hover:text-primary md:hidden'
                  >
                    Thay đổi mật khẩu
                  </NavLink>
                  <NavLink
                    to={`/${userPath}/${order}`}
                    className='cursor-pointer py-[9px] pl-5 pr-16 text-left capitalize hover:bg-gray-100 hover:text-primary'
                  >
                    Đơn mua
                  </NavLink>
                  <button
                    onClick={LogoutHandle}
                    className='cursor-pointer py-[9px] pl-5 pr-16 text-left capitalize hover:bg-gray-100 hover:text-primary'
                  >
                    Đăng xuất
                  </button>
                </div>
              </Popover>
            ) : (
              <>
                <Link
                  to={'/register'}
                  className={
                    'flex flex-row items-center justify-center border-r-[1px] pr-4 lg:pr-3 xl:pr-4'
                  }
                >
                  Đăng Kí
                </Link>
                <Link
                  to={'/login'}
                  className={'flex flex-row items-center justify-center'}
                >
                  Đăng Nhập
                </Link>
              </>
            )}
          </div>
        </div>
        <div className='flex items-end justify-between'>
          <Link to={'/'} className='flex items-end'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-8 w-8 md:h-10 md:w-10 lg:h-10 lg:w-10 xl:h-12 xl:w-12'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
              />
            </svg>
            <label className='ml-2 cursor-pointer font-serif text-xl md:text-2xl lg:text-2xl xl:text-3xl'>
              {location.pathname.includes('cart') ? 'Giỏ hàng' : 'TechShop'}
            </label>
          </Link>
          <div className='relative flex w-[55%] justify-between md:w-[70%] lg:w-[70%] xl:w-[70%]'>
            <div
              className={`relative flex h-[26px] w-[85%] items-end overflow-hidden rounded-sm bg-white md:h-[30px] lg:h-[30px] xl:h-[40px]`}
            >
              <form onSubmit={onSubmit}>
                <input
                  type='text'
                  className={`absolute left-0 top-0 h-full w-[90%] pl-3 text-[8px] text-sm text-gray-600 outline-none placeholder:text-xs md:text-[10px] lg:text-[12px] xl:text-xs`}
                  disabled={location.pathname.includes('cart')}
                  placeholder='Sale lên đến 90%'
                  {...register('search')}
                />
                <button
                  disabled={location.pathname.includes('cart')}
                  onClick={onSubmit}
                  className='absolute right-1 top-[50%] flex h-[20px] w-[30px] translate-y-[-50%] items-center justify-center rounded-sm bg-header xl:h-[32px] xl:w-[55px]'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-4 w-4 xl:h-6 xl:w-6'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
                    />
                  </svg>
                </button>
              </form>
            </div>
            <Popover
              to={PathRoute.cart}
              as={
                <NavLink
                  to={`/${PathRoute.cart}`}
                  className={`cursor-pointer self-end`}
                >
                  <Badge
                    color='#FAFAFA'
                    style={{
                      color: '#ee4d2d',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                    size='small'
                    offset={[-2, 5]}
                    count={
                      purchaseData && purchaseData?.length > 9
                        ? '9+'
                        : purchaseData?.length
                    }
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth={1.25}
                      stroke='currentColor'
                      className='h-6 w-6 text-white md:h-8 md:w-8 lg:h-8 lg:w-8 xl:h-9 xl:w-9'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                      />
                    </svg>
                  </Badge>
                </NavLink>
              }
              off={5}
              classNameBlock={'ml-4 flex'}
              classNameArrow={
                'translate-l-[-50%] absolute top-[-6.5%] border-[12px] border-solid border-white border-x-transparent border-t-transparent cursor-pointer'
              }
            >
              {purchaseData && purchaseData.length >= 1 ? (
                <div className='relative hidden flex-col rounded-sm bg-white text-[12px] text-gray-600 shadow-md lg:flex lg:h-[356.8px] lg:w-[400px]'>
                  <div className='p-3 capitalize text-gray-300'>
                    Sản phẩm mới thêm
                  </div>
                  {purchaseData.slice(0, 4).map((purchase) => (
                    <NavLink
                      to={`/${initId(purchase.product.name)}-id,${
                        purchase.product._id
                      }`}
                      className='flex cursor-pointer p-3 hover:bg-gray-200'
                      key={purchase.product._id}
                    >
                      <div className='h-[42px] w-[42px]'>
                        <img src={purchase.product.image} alt='logo' />
                      </div>
                      <div className='mx-3 h-[42px] w-[231px] truncate capitalize'>
                        {purchase.product.name}
                      </div>
                      <div className='text-primary'>
                        ₫{convertCurrentcy(purchase.product.price, 2)}
                      </div>
                    </NavLink>
                  ))}
                  <div className='absolute bottom-0 left-0 right-0 flex items-center justify-between p-3'>
                    <div className='p-3'>
                      {purchaseData.length > 4
                        ? `${purchaseData.length - 4} Thêm hàng vào giỏ`
                        : ''}
                    </div>
                    <NavLink
                      to={`/${PathRoute.cart}`}
                      className='rounded-sm bg-primary px-4 py-2 text-white'
                    >
                      Xem giỏ hàng
                    </NavLink>
                  </div>
                </div>
              ) : (
                <div className='hidden items-center justify-center rounded-sm bg-white text-[12px] text-gray-600 shadow-sm md:flex lg:h-[356.8px] lg:w-[400px]'>
                  <Empty
                    className='m-auto'
                    image='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/9bdd8040b334d31946f49e36beaf32db.png'
                    description={<span>Chưa có sản phẩm</span>}
                  />
                </div>
              )}
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
