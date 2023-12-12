import React from 'react'
import AsideUser from './AsideUser'
import { Outlet } from 'react-router-dom'

function User() {
  return (
    <div className='bg-backg text-xs md:text-sm xl:text-base'>
      <div className='flex justify-between bg-backg md:mx-auto md:max-w-3xl md:p-2 lg:max-w-4xl lg:px-0 lg:py-2 xl:max-w-7xl'>
        <div className='hidden md:block md:w-[20%] lg:w-[17%] xl:w-[15%]'>
          <AsideUser />
        </div>
        <div className='mx-auto p-2 md:mx-0 md:w-[80%] md:p-0 md:pl-12 lg:w-[83%] xl:w-[85%]'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default User
