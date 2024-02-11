import { createBrowserRouter } from 'react-router-dom'

import { MainLayout } from 'src/layouts/MainLayout'

import authenticationRoute from './authentication.route'
import orderDetailRoute from './order-detail.route'
import orderRoute from './order.route'
import overViewRoute from './over-view.route'
import productRoute from './product.route'
import profileRoute from './profile.route'
import viewRoute from './views.route'

export const routes = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            overViewRoute,
            profileRoute,
            viewRoute,
            orderRoute,
            orderDetailRoute,
            productRoute
        ]
    },
    authenticationRoute
])
