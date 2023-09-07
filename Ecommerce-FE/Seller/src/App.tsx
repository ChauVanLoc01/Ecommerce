import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Home from './Pages/Home'
import Header from './Components/Header'

const Login = React.lazy(() => import('./Pages/Login'))
const Register = React.lazy(() => import('./Pages/Register'))

function App() {
  return (
    <div className='xll:max-w-screen-xl mx-auto w-full overflow-hidden text-sm bg-[#F6F6F6]'>
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
