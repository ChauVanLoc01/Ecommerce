import loadable from '@loadable/component'
import { QueryClient } from '@tanstack/react-query'
import { createBrowserRouter } from 'react-router-dom'

import { route } from 'src/constants/route'
import Login from 'src/pages/Auth'

const MainLayout = loadable(() => import('src/layouts/MainLayout'))
const Analytic = loadable(() => import('src/pages/Analytic'))
const Profile = loadable(() => import('src/pages/Profile'))
const Password = loadable(() => import('src/pages/Profile/LayoutProfile/Password'))
const PersonalInformation = loadable(() => import('src/pages/Profile/LayoutProfile/PersonalInformation'))

export const queryClient = new QueryClient()

const routes = createBrowserRouter([
    {
        path: route.root,
        element: <MainLayout />,
        children: [
            {
                index: true,
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
                path: route.store
            },
            {
                path: route.order
            },
            {
                path: route.product
            }
        ]
    },
    {
        path: route.login,
        element: <Login />
    }
])

export default routes
