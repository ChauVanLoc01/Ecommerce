import Sidebar from 'src/Components/Sidebar'
import { Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'

function Home() {
  return (
    <div className='flex'>
      <div className='basis-1/5'>
        <Sidebar />
      </div>
      <SimpleBar
        forceVisible='y'
        autoHide={true}
        style={{
          height: '100vh',
          maxHeight: '100vh',
          width: '80%',
          padding: '12px'
        }}
      >
        <Outlet />
      </SimpleBar>
    </div>
  )
}

export default Home
