import loadable from '@loadable/component'
import { Portal } from '@radix-ui/themes'
import { useContext, useState } from 'react'
import { Outlet, useBeforeUnload } from 'react-router-dom'
import 'react-vertical-timeline-component/style.min.css'
import SimpleBar from 'simplebar-react'
import { endLoadingLoader, exitEvent, startLoadingLoader } from 'src/constants/event'
import { AppContext } from 'src/contexts/AppContext'
import { ls, setProduct } from 'src/utils/localStorage'

const Header = loadable(() => import('./Header'))

const MainLayout = () => {
    const { setProfile, setProducts, profile, products } = useContext(AppContext)
    const [loadingLoader, setLoadingLoader] = useState<boolean>(false)

    window.addEventListener(exitEvent, () => {
        setProfile(undefined)
        setProducts({ total: 0, stores: {} })
        ls.deleteItem('profile')
        ls.deleteItem('products')
    })

    window.addEventListener(startLoadingLoader, () => setLoadingLoader(true))
    window.addEventListener(endLoadingLoader, () => setLoadingLoader(false))

    useBeforeUnload(() => {
        if (profile) {
            ls.setItem('profile', profile)
        }
        if (products) {
            setProduct(products)
        }
    })

    return (
        <>
            <div className='bg-[#F8F9FA] min-h-screen h-screen overflow-hidden select-none'>
                <SimpleBar style={{ maxHeight: '100vh', height: '100vh' }}>
                    <div className='mx-auto w-full max-w-screen-xl max-h-screen'>
                        <Header />
                        <Outlet />
                    </div>
                </SimpleBar>
            </div>
            {loadingLoader && (
                <Portal>
                    <div className='fixed inset-0 flex justify-center items-center z-50 bg-black/20'>
                        <div className='loader' />
                    </div>
                </Portal>
            )}
        </>
    )
}

export default MainLayout
