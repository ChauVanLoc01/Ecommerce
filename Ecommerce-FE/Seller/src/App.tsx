import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './Pages/Home'
import Header from './Components/Header'

const Login = React.lazy(() => import('./Pages/Login'))
const Register = React.lazy(() => import('./Pages/Register'))

function App() {
  return (
    <div className='base'>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
      </Routes>
    </div>
  )
}

export default App
