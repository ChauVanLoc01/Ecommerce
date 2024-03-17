import loadable from '@loadable/component'
import { createBrowserRouter } from 'react-router-dom'

import { route } from 'src/constants/route'
import MainLayout from 'src/layouts/MainLayout'
import { productDetailLoader, productListLoader } from 'src/loaders/product.loader'
import Checkout from 'src/pages/Checkout'
import Profile from 'src/pages/Profile'
import ChangePassword from 'src/pages/Profile/LayoutProfile/ChangePassword'
import Order from 'src/pages/Profile/LayoutProfile/Order'
import Payment from 'src/pages/Profile/LayoutProfile/Payment'
import PersonalInformation from 'src/pages/Profile/LayoutProfile/PersonalInformation'

const Login = loadable(() => import('src/pages/Login'))
const Register = loadable(() => import('src/pages/Register'))

const ProductList = loadable(() => import('src/pages/ProductList'))
const Product = loadable(() => import('src/pages/Product'))

const routes = createBrowserRouter([
    {
        path: route.login,
        element: <Login />
    },
    {
        path: route.register,
        element: <Register />
    },
    {
        path: route.root,
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <ProductList />,
                loader: productListLoader
            },
            {
                path: ':productId',
                element: <Product />,
                loader: productDetailLoader
            },
            {
                path: 'profile',
                element: <Profile />,
                children: [
                    {
                        index: true,
                        element: <PersonalInformation />
                    },
                    {
                        path: route.order,
                        element: <Order />
                    },
                    {
                        path: route.changePassword,
                        element: <ChangePassword />
                    },
                    {
                        path: route.payment,
                        element: <Payment />
                    }
                ]
            },
            {
                path: route.checkout,
                element: <Checkout />
            }
        ]
    }
])

export default routes
