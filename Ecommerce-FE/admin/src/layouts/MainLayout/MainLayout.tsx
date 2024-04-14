import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import Header from './Header'
import SideNav from './SideNav'
import { useEffect } from 'react'
import { route } from 'src/constants/route'

const MainLayout = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate(route.analytic)
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
