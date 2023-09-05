import { Routes, Route } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout'
import React from 'react'
import Product from './Components/Product'
import SecondLayout from './Layouts/SecondLayout'

// Tối ưu hóa file build
const Home = React.lazy(() => import('./Pages/Home'))
const ProductList = React.lazy(() => import('./Pages/ProductList'))
const Register = React.lazy(() => import('./Pages/Register'))
const Login = React.lazy(() => import('./Pages/Login'))

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path='products' element={<ProductList />} />
        <Route path=':productId' element={<Product />} />
      </Route>
      <Route
        path='login'
        element={
          <SecondLayout>
            <Login />
          </SecondLayout>
        }
      />
      <Route
        path='register'
        element={
          <SecondLayout>
            <Register />
          </SecondLayout>
        }
      />
    </Routes>
  )
}

export default App
