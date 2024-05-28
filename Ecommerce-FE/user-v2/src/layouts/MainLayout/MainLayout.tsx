import loadable from '@loadable/component'
import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import { exitEvent } from 'src/constants/event'
import { AppContext } from 'src/contexts/AppContext'
import { ls } from 'src/utils/localStorage'

const Header = loadable(() => import('./Header'))

const MainLayout = () => {
    const { setProfile } = useContext(AppContext)

    window.addEventListener(exitEvent, () => {
        setProfile(undefined)
        ls.deleteItem('profile')
    })

    return (
        <div className='bg-[#F8F9FA] min-h-screen h-screen overflow-hidden select-none'>
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
