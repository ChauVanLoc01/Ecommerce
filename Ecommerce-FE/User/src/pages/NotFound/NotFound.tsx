import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className='flex h-screen w-full flex-col items-center justify-center'>
      <h1 className='text-9xl font-extrabold tracking-widest text-gray-700'>
        404
      </h1>
      <div className='bg-orange text-md absolute rotate-12 rounded bg-primary px-2 font-semibold text-product'>
        Page Not Found
      </div>
      <button className='mt-5 rounded-sm text-primary shadow-md duration-300 ease-linear hover:bg-primary/90 hover:text-product'>
        <Link
          to='/'
          className='group relative inline-block text-xl font-medium focus:outline-none focus:ring active:text-orange-500'
        >
          <span className='bg-orange absolute inset-0 translate-x-0.5 translate-y-0.5 transition-transform group-hover:translate-y-0 group-hover:translate-x-0' />
          <span className='relative block border border-current px-8 py-3'>
            <span>Về lại trang chủ</span>
          </span>
        </Link>
      </button>
    </main>
  )
}

export default NotFound
