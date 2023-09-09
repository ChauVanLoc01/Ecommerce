import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './Pages/Home'
import Header from './Components/Header'

const Login = React.lazy(() => import('./Pages/Login'))
const Register = React.lazy(() => import('./Pages/Register'))
const Management = React.lazy(() => import('./Components/Management'))
const OverView = React.lazy(() => import('./Pages/Home/OverView'))
const Rating = React.lazy(() => import('./Pages/Rating'))

function App() {
  return (
    <div className='w-screen h-screen xxl:max-h-fit bg-[#F6F6F6] text-gray-700'>
      <div className='xxl:max-w-screen-xl mx-auto w-full overflow-hidden text-sm h-screen lg:block xs:hidden'>
        <Header />
        <Routes>
          <Route path='/' element={<Home />}>
            <Route index element={<OverView />} />
            <Route path='mana' element={<Management />} />
            <Route path='rating' element={<Rating />} />
          </Route>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Routes>
      </div>
      <div className='w-screen h-screen xs:flex lg:hidden relative justify-center items-center'>
        <h2 className='absolute left-1/2 top-10 -translate-x-1/2 font-semibold'>
          Xin Lỗi! Hiện tại chúng tôi chưa hỗ trợ giao diện ở mobile
        </h2>
        <img src='src/Assets/sorry.png' alt='image' className='object-cover w-5/6' />
      </div>
    </div>
  )
}

export default App
