import { Routes, Route } from 'react-router-dom'
import React from 'react'
import Header from './Components/Header'

// Tối ưu hóa file build
const Home = React.lazy(() => import('./Pages/Home'))

function App() {
  return (
    <div className='base'>
      <Header />
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
