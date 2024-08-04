import { Outlet, useBeforeUnload, useLocation, useNavigate } from 'react-router-dom'

import { setDefaultOptions } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useContext, useEffect } from 'react'
import 'react-vertical-timeline-component/style.min.css'
import { exitEvent } from 'src/constants/event.constants'
import { OBJECT } from 'src/constants/role'
import { route, route_default_with_role } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import useLoadingFetching from 'src/hooks/useLoadingFetching'
import { queryClient } from 'src/routes/main.route'
import { ls } from 'src/utils/localStorage'
import Header from './Header'
import SideNav from './SideNav'

setDefaultOptions({ locale: vi })

const MainLayout = () => {
    const { setProfile, setStore, who, profile, store, role } = useContext(AppContext)
    const [loadingFetching] = useLoadingFetching()
    const navigate = useNavigate()
    const location = useLocation()

    window.addEventListener(exitEvent, () => {
        setProfile(undefined)
        setStore(undefined)
        ls.clearAll()
        queryClient.clear()
    })

    useEffect(() => {
        location.pathname === route.root && navigate(route_default_with_role[who as OBJECT])
    }, [])

    useBeforeUnload(() => {
        if (!/login/.test(location.pathname)) {
            ls.setItem('profile', profile)
            ls.setItem('store', store)
            ls.setItem('role', role)
            ls.setItem('who', who as string)
        }
    })

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
