import loadable from '@loadable/component'
import { Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'

const Header = loadable(() => import('./Header'))

const MainLayout = () => {
    return (
        <div className='bg-[#F8F9FA] min-h-screen select-none'>
            <SimpleBar style={{ maxHeight: '100vh', height: '100vh' }}>
                <div className='mx-auto w-full max-w-screen-xl max-h-screen'>
                    <Header />
                    <Outlet />
                </div>
            </SimpleBar>
        </div>
    )
}

export default MainLayout
