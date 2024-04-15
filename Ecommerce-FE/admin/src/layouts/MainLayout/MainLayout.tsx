import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useEffect } from 'react'
import { route } from 'src/constants/route'
import Header from './Header'
import SideNav from './SideNav'

const MainLayout = () => {
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        location.pathname === route.root && navigate(route.analytic)
    }, [])

    return (
        <div className='h-screen flex bg-[#F8F9FA]'>
            <SideNav />
            <main className='px-48 py-8 basis-5/6'>
                <Header />
                <Outlet />
            </main>
        </div>
    )
}

export default MainLayout
