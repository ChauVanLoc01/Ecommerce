import loadable from '@loadable/component'
import { createBrowserRouter } from 'react-router-dom'

import { route } from 'src/constants/route'
import MainLayout from 'src/layouts/MainLayout'

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
                element: <ProductList />
            },
            {
                path: ':productId',
                element: <Product />
            }
        ]
    }
])

export default routes
