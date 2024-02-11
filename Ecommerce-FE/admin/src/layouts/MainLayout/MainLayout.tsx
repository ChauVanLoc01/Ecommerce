import { Outlet } from 'react-router-dom'

import Header from './Header'
import SideNav from './SideNav'

const MainLayout = () => {
    return (
        <div className='h-screen flex'>
            <SideNav />
            <main className='px-48 py-8 basis-5/6'>
                <Header />
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout
