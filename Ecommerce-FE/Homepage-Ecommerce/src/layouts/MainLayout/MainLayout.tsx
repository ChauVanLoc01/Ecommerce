import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

function MainLayout() {
  const location = useLocation()
  return (
    <div className='select-none'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default MainLayout
