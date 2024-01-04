import classNames from 'classnames'
import React from 'react'
import { useLocation } from 'react-router-dom'

function Footer() {
  const location = useLocation()
  return (
    <footer
      className={`block py-6 text-[12px] sm:py-10 lg:py-16 xl:py-20 ${classNames(
        {
          'hidden bg-footer md:block': location.pathname.includes('cart')
        }
      )}`}
    >
      <div className='mx-auto lg:max-w-7xl'>
        <div className='space-y-1 text-center text-gray-400 sm:space-y-2 sm:text-base md:space-y-3 lg:space-y-4 lg:text-2xl xl:text-3xl'>
          <h2>Project Technology Shop</h2>
          <p>Người xây dựng: Văn Lộc</p>
          <p>Project được triển khai dành cho mục đích học tập</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
