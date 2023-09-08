import Sidebar from 'src/Components/Sidebar'
import { Scrollbars } from 'react-custom-scrollbars'
import { Outlet } from 'react-router-dom'

function Home() {
  return (
    <div className='flex'>
      <div className='basis-1/5'>
        <Sidebar />
      </div>
      <Scrollbars style={{ width: '100%', height: 'auto' }} autoHide={true} className='lg:basis-4/5 w-full'>
        <Outlet />
      </Scrollbars>
    </div>
  )
}

export default Home
