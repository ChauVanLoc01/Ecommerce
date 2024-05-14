import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useContext, useEffect } from 'react'
import { exitEvent } from 'src/constants/event.constants'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import useLoadingFetching from 'src/hooks/useLoadingFetching'
import { ls } from 'src/utils/localStorage'
import Header from './Header'
import SideNav from './SideNav'

const MainLayout = () => {
    const { setProfile, setStore } = useContext(AppContext)
    const [loadingFetching] = useLoadingFetching()
    const navigate = useNavigate()
    const location = useLocation()

    window.addEventListener(exitEvent, () => {
        console.log('exitEvent')
        setProfile(undefined)
        setStore(undefined)
        ls.clearAll()
        navigate('/login')
    })

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
