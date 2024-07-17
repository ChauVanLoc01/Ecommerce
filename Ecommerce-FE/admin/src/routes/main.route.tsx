import loadable from '@loadable/component'
import { QueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouteObject } from 'react-router-dom'
import Error from 'src/components/Error/Error'
import { OBJECT, RoleType, SERVICE, SERVICE_NAME } from 'src/constants/role'

import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { analyticsLoader } from 'src/loader/analytics.loader'
import { employeeLoader } from 'src/loader/employee.loader'
import { flashSaleLoader } from 'src/loader/flash-sale.loader'
import { orderLoader } from 'src/loader/order.loader'
import { productLoader } from 'src/loader/product.loader'
import { ratingLoader } from 'src/loader/rating.loader'
import { voucherLoader } from 'src/loader/voucher.loader'
import Login from 'src/pages/Auth'
import Employee from 'src/pages/Employee'
import FlashSale from 'src/pages/FlashSale/FlashSale'
import Order from 'src/pages/Order'
import PageNotFound from 'src/pages/PageNotFound/PageNotFound'
import Product from 'src/pages/Product'
import Rating from 'src/pages/Rating/Rating'
import Store from 'src/pages/Store'
import Voucher from 'src/pages/Voucher/Voucher'
import { ls } from 'src/utils/localStorage'

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

let roleLS = ls.getItem('role')

const PrivateRouteDefault: Record<SERVICE, RouteObject> = {
    Overview: {
        path: route.analytic,
        element: <Analytic />,
        loader: analyticsLoader
    },
    FlashSale: {
        path: route.flashSale,
        element: <FlashSale />,
        loader: flashSaleLoader
    },
    Product: {
        path: route.product,
        element: <Product />,
        loader: productLoader
    },
    Order: {
        path: route.order,
        element: <Order />,
        loader: orderLoader
    },
    Employee: {
        path: route.employee,
        element: <Employee />,
        loader: employeeLoader
    },
    Rating: {
        path: route.rating,
        element: <Rating />,
        loader: ratingLoader
    },
    Voucher: {
        path: route.voucher,
        element: <Voucher />,
        loader: voucherLoader
    }
}

export const side_nav: { label: string; path: string; icon: string }[] = []

const RouterOfRole: RouteObject[] = roleLS
    ? Object.entries(JSON.parse(roleLS) as RoleType[OBJECT]).reduce<RouteObject[]>((acum, [key, value]) => {
          if (value.length) {
              side_nav.push(SERVICE_NAME[key as SERVICE])
              acum.push(PrivateRouteDefault[key as SERVICE])
              return acum
          }
          return acum
      }, [])
    : []

console.log('main route load')

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            networkMode: 'online'
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
                    {
                        path: route.store,
                        element: <Store />
                    },
                    ...RouterOfRole,
                    {
                        path: '*',
                        element: <PageNotFound content='Bạn không có quyền truy cập vào tài nguyên này' />
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
    },
    {
        path: '*',
        element: <PageNotFound />
    }
])

export default routes
