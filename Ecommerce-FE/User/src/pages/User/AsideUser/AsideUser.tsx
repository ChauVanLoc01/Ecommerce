import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useMemo } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { UserFetching } from 'src/Api/UserFetching'
import { PathRoute } from 'src/constants/PathRoute'
import { PurchaseStatus } from 'src/constants/PurchaseStatus'
import { urlApi } from 'src/constants/config'

const { account, user, profile, address, password, order } = PathRoute

function AsideUser() {
  const location = useLocation()
  const getUserFetching = useQuery({
    queryKey: ['user'],
    queryFn: UserFetching.GetUserFetching
  })
  const avatar = getUserFetching.data?.data.data.avatar
  const url = {
    profilePath: `/${user}/${account}/${profile}`,
    addressPath: `/${user}/${account}/${address}`,
    passwordPath: `/${user}/${account}/${password}`,
    orderPath: `/${user}/${order}`
  }
  return (
    <div className='sticky top-0'>
      <div className='flex cursor-pointer items-center border-b-[1px] border-b-gray-200 pt-3 pb-6'>
        {avatar ? (
          <img
            src={`${urlApi}images/${avatar}`}
            alt='avatar'
            className='mr-3 h-12 w-12 rounded-full border-[1px] border-gray-100 object-cover'
          />
        ) : (
          <div className='mr-3 rounded-full border border-gray-300 p-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-6 w-6 text-gray-400'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
              />
            </svg>
          </div>
        )}
        <div>
          <p className='font-semibold'>Chau_Van_Loc</p>
          <p className='mt-1 flex items-center justify-evenly'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-3 w-3'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125'
              />
            </svg>
            Sửa hồ sơ
          </p>
        </div>
      </div>
      <div className='mt-7'>
        <NavLink to={url.profilePath} className='flex items-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-5 w-5 text-blue'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
            />
          </svg>
          <p className='ml-3 capitalize'>tài khoản của tôi</p>
        </NavLink>
        <div className='flex flex-col py-5 pl-8'>
          <NavLink
            to={url.profilePath}
            className={`text-gray-500 ${classNames({
              'text-primary': location.pathname === url.profilePath
            })}`}
          >
            Hồ Sơ
          </NavLink>
          <NavLink
            to={url.passwordPath}
            className={`mt-6 text-gray-500 ${classNames({
              'text-primary': location.pathname === url.passwordPath
            })}`}
          >
            Mật Khẩu
          </NavLink>
        </div>
      </div>
      <NavLink
        to={url.orderPath}
        className={`mt-3 flex cursor-pointer items-center ${classNames({
          'text-primary': location.pathname === url.orderPath
        })}`}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5 text-blue'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
          />
        </svg>

        <p className='ml-3'>Đơn Mua</p>
      </NavLink>
    </div>
  )
}

export default AsideUser
