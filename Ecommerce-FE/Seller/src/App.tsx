import { Routes, Route } from 'react-router-dom'
import { Path } from './constants/path.enum'
import OverView from './Pages/OverView'
import Rating from './Pages/Rating'
import Profile from './Pages/Profile'
import Login from './Pages/Login'
import MainLayout from './layouts/MainLayout'
import Order from './Pages/Order'
import Product from './Pages/Product'
import { createPortal } from 'react-dom'

function App() {
  const isShowLoading = false
  return (
    <div className='w-screen h-screen bg-[#F6F6F6] text-gray-700'>
      <div className='mx-auto w-full text-xs h-screen overflow-hidden'>
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<OverView />} />
            <Route path={Path.profile} element={<Profile />} />
            <Route path={Path.order} element={<Order />} />
            <Route path={Path.product} element={<Product />} />
            <Route path={Path.rating} element={<Rating />} />
          </Route>
          <Route path={Path.login} element={<Login />} />
        </Routes>
      </div>
      <div className='w-screen h-screen xs:flex lg:hidden relative justify-center items-center'>
        <h2 className='absolute left-1/2 top-10 -translate-x-1/2 font-semibold'>
          Xin Lỗi! Hiện tại chúng tôi chưa hỗ trợ giao diện ở mobile
        </h2>
        <img src='src/Assets/sorry.png' alt='image' className='object-cover w-5/6' />
      </div>
      {isShowLoading &&
        createPortal(
          <div className='wrap-loader'>
            <div className='layout' />
            <div className='loader' />
          </div>,
          document.body
        )}
    </div>
  )
}

export default App
