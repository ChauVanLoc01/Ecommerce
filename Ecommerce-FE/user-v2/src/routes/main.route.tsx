import loadable from '@loadable/component'
import { QueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import MainLayout from 'src/layouts/MainLayout'
import { deliveryLoader } from 'src/loaders/delivery.loader'
import { ordersLoader } from 'src/loaders/order.loader'
import { productDetailLoader, productListLoader } from 'src/loaders/product.loader'
import { profileLoader } from 'src/loaders/profile.loader'
import { storeLoader } from 'src/loaders/store.loader'
import Checkout from 'src/pages/Checkout'
import Error from 'src/pages/Error/Error'
import NotFound from 'src/pages/NotFound'
import Profile from 'src/pages/Profile'
import Address from 'src/pages/Profile/LayoutProfile/Address'
import ChangePassword from 'src/pages/Profile/LayoutProfile/ChangePassword'
import Order from 'src/pages/Profile/LayoutProfile/Order'
import Payment from 'src/pages/Profile/LayoutProfile/Payment'
import PersonalInformation from 'src/pages/Profile/LayoutProfile/PersonalInformation'
import Store from 'src/pages/Store'

const Login = loadable(() => import('src/pages/Login'))
const Register = loadable(() => import('src/pages/Register'))

const ProductList = loadable(() => import('src/pages/ProductList'))
const Product = loadable(() => import('src/pages/Product'))

const PrivateRoute = () => {
    const { profile, previousPage } = useContext(AppContext)
    return profile ? (
        <Outlet />
    ) : previousPage === route.profile ? (
        <Navigate to={route.root} />
    ) : (
        <Navigate to={route.login} />
    )
}

const RejectRoute = () => {
    const { profile } = useContext(AppContext)
    return profile ? <Navigate to={route.root} /> : <Outlet />
}

export const queryClient = new QueryClient()

const routes = createBrowserRouter([
    {
        element: <RejectRoute />,
        children: [
            {
                path: route.login,
                element: <Login />
            },
            {
                path: route.register,
                element: <Register />
            }
        ]
    },
    {
        path: route.root,
        element: <MainLayout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <ProductList />,
                loader: productListLoader
            },
            {
                path: 'store/:storeId',
                element: <Store />,
                loader: storeLoader
            },
            {
                path: ':productId',
                element: <Product />,
                loader: productDetailLoader
            },
            {
                element: <PrivateRoute />,
                children: [
                    {
                        path: 'profile',
                        element: <Profile />,
                        children: [
                            {
                                index: true,
                                element: <PersonalInformation />,
                                loader: profileLoader
                            },
                            {
                                path: route.order,
                                element: <Order />,
                                loader: ordersLoader
                            },
                            {
                                path: route.changePassword,
                                element: <ChangePassword />
                            },
                            {
                                path: route.payment,
                                element: <Payment />
                            },
                            {
                                path: route.address,
                                element: <Address />,
                                loader: deliveryLoader
                            }
                        ]
                    },
                    {
                        path: route.checkout,
                        element: <Checkout />,
                        loader: deliveryLoader
                    }
                ]
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])

export default routes
