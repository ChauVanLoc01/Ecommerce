import loadable from '@loadable/component'
import { createBrowserRouter } from 'react-router-dom'

import { route } from 'src/constants/route'

const MainLayout = loadable(() => import('src/layouts/MainLayout'))
const Analytic = loadable(() => import('src/pages/Analytic'))
const Profile = loadable(() => import('src/pages/Profile'))
const Password = loadable(
    () => import('src/pages/Profile/LayoutProfile/Password')
)
const PersonalInformation = loadable(
    () => import('src/pages/Profile/LayoutProfile/PersonalInformation')
)

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
        path: route.login
    }
])

export default routes
