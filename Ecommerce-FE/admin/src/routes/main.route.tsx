import loadable from '@loadable/component'
import { QueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouteObject } from 'react-router-dom'
import Error from 'src/components/Error/Error'
import { AdminAuth, StoreOwnerAndEmployeeAuth, StoreOwnerAuth } from 'src/components/Role/Role'
import { OBJECT, SERVICE } from 'src/constants/role'

import { route, route_default_with_role } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { analyticsLoader } from 'src/loader/analytics.loader'
import { employeeLoader } from 'src/loader/employee.loader'
import { flashSaleLoader } from 'src/loader/flash-sale.loader'
import { orderLoader } from 'src/loader/order.loader'
import { productLoader } from 'src/loader/product.loader'
import { ratingLoader } from 'src/loader/rating.loader'
import { storeLoader } from 'src/loader/store.loader'
import { userLoader } from 'src/loader/user.loader'
import { voucherLoader } from 'src/loader/voucher.loader'
import Login from 'src/pages/Auth'
import Employee from 'src/pages/Employee'
import FlashSale from 'src/pages/FlashSale/FlashSale'
import Order from 'src/pages/Order'
import Overview from 'src/pages/Overview/Overview'
import PageNotFound from 'src/pages/PageNotFound/PageNotFound'
import Product from 'src/pages/Product'
import Rating from 'src/pages/Rating/Rating'
import Store from 'src/pages/Store/Store'
import User from 'src/pages/User/User'
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
    const { profile, who } = useContext(AppContext)
    return profile ? <Navigate to={route_default_with_role[who as OBJECT]} /> : <Outlet />
}

const PrivateRouteDefault: Record<SERVICE, RouteObject> = {
    Overview: {
        path: route.over_view,
        element: (
            <AdminAuth>
                <Overview />
            </AdminAuth>
        )
    },
    Analytics: {
        path: route.analytic,
        element: (
            <StoreOwnerAuth>
                <Analytic />
            </StoreOwnerAuth>
        ),
        loader: analyticsLoader
    },
    FlashSale: {
        path: route.flashSale,
        element: (
            <StoreOwnerAndEmployeeAuth>
                <FlashSale />
            </StoreOwnerAndEmployeeAuth>
        ),
        loader: flashSaleLoader
    },
    Product: {
        path: route.product,
        element: (
            <StoreOwnerAndEmployeeAuth>
                <Product />
            </StoreOwnerAndEmployeeAuth>
        ),
        loader: productLoader
    },
    Order: {
        path: route.order,
        element: (
            <StoreOwnerAndEmployeeAuth>
                <Order />
            </StoreOwnerAndEmployeeAuth>
        ),
        loader: orderLoader
    },
    Employee: {
        path: route.employee,
        element: (
            <StoreOwnerAuth>
                <Employee />
            </StoreOwnerAuth>
        ),
        loader: employeeLoader
    },
    Rating: {
        path: route.rating,
        element: (
            <StoreOwnerAndEmployeeAuth>
                <Rating />
            </StoreOwnerAndEmployeeAuth>
        ),
        loader: ratingLoader
    },
    Voucher: {
        path: route.voucher,
        element: <Voucher />,
        loader: voucherLoader
    },
    Store: {
        path: route.store,
        element: (
            <AdminAuth>
                <Store />
            </AdminAuth>
        ),
        loader: storeLoader
    },
    User: {
        path: route.user,
        element: (
            <AdminAuth>
                <User />
            </AdminAuth>
        ),
        loader: userLoader
    }
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: 'online',
            staleTime: 1000 * 30
        },
        mutations: {
            networkMode: 'online'
        }
    }
})

const routes = createBrowserRouter([
    {
        element: <PrivateRoute />,
        children: [
            {
                path: route.root,
                element: <MainLayout />,
                errorElement: <Error />,
                children: [
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
                    ...Object.values(PrivateRouteDefault),
                    {
                        path: route.permission,
                        element: <PageNotFound content='Bạn không có quyền truy cập' />
                    },
                    {
                        path: '*',
                        element: <PageNotFound />
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
