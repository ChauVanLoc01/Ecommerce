import loadable from '@loadable/component'
import { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import { AppContext } from 'src/contexts/AppContext'
import { ls } from 'src/utils/localStorage'

const Header = loadable(() => import('./Header'))

const MainLayout = () => {
    const { products, profile } = useContext(AppContext)

    useEffect(() => {
        ls.getItem('products') && ls.deleteItem('products')
        products.length > 0 && ls.setItem('products', JSON.stringify(products))
    }, [products])

    useEffect(() => {
        ls.getItem('profile') && ls.deleteItem('profile')
        profile && ls.setItem('profile', JSON.stringify(profile))
    }, [profile])

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
