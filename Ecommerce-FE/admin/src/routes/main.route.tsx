import loadable from '@loadable/component'
import { QueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { employeeLoader } from 'src/loader/employee.loader'
import { orderLoader } from 'src/loader/order.loader'
import { productLoader } from 'src/loader/product.loader'
import Login from 'src/pages/Auth'
import Employee from 'src/pages/Employee'
import Order from 'src/pages/Order'
import Product from 'src/pages/Product'
import Store from 'src/pages/Store'
import Voucher from 'src/pages/Voucher/Voucher'

const MainLayout = loadable(() => import('src/layouts/MainLayout'))
const Analytic = loadable(() => import('src/pages/Analytic'))
const Profile = loadable(() => import('src/pages/Profile'))
const Password = loadable(() => import('src/pages/Profile/LayoutProfile/Password'))
const PersonalInformation = loadable(() => import('src/pages/Profile/LayoutProfile/PersonalInformation'))

const PrivateRoute = () => {
    const { profile } = useContext(AppContext)
    return profile ? <Outlet /> : <Navigate to={'/login'} />
}

const RejectRoute = () => {
    const { profile } = useContext(AppContext)
    return profile ? <Navigate to={route.analytic} /> : <Outlet />
}

export const queryClient = new QueryClient()

const routes = createBrowserRouter([
    {
        element: <PrivateRoute />,
        children: [
            {
                path: route.root,
                element: <MainLayout />,
                children: [
                    {
                        path: route.analytic,
                        element: <Analytic />
                    },
                    {
                        path: route.profile,
                        element: <Profile />,
                        children: [
                            {
                                index: true,
                                element: <PersonalInformation />
                            },
                            {
                                path: route.changePassword,
                                element: <Password />
                            }
                        ]
                    },
                    {
                        path: route.store,
                        element: <Store />
                    },
                    {
                        path: route.order,
                        element: <Order />,
                        loader: orderLoader
                    },
                    {
                        path: route.employee,
                        element: <Employee />,
                        loader: employeeLoader
                    },
                    {
                        path: route.product,
                        element: <Product />,
                        loader: productLoader
                    },
                    {
                        path: route.voucher,
                        element: <Voucher />
                    }
                ]
            }
        ]
    },
    {
        element: <RejectRoute />,
        children: [
            {
                path: route.login,
                element: <Login />
            }
        ]
    }
])

export default routes
