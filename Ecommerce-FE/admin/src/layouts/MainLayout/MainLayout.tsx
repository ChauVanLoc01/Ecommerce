import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useEffect } from 'react'
import { route } from 'src/constants/route'
import useLoadingFetching from 'src/hooks/useLoadingFetching'
import Header from './Header'
import SideNav from './SideNav'

const MainLayout = () => {
    const [loadingFetching] = useLoadingFetching()
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        location.pathname === route.root && navigate(route.analytic)
    }, [])

    return (
        <>
            <div className='h-screen flex bg-[#F8F9FA]'>
                <SideNav />
                <main className='px-48 py-8 basis-5/6'>
                    <Header />
                    <Outlet />
                </main>
            </div>
            {loadingFetching && (
                <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/20'>
                    <div className='loader' />
                </div>
            )}
        </>
    )
}

export default MainLayout
