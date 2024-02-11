import { RouteObject } from 'react-router-dom'

import { Path } from 'src/constants/path.enum'
import Login from 'src/Pages/Login'

const authenticationRoute: RouteObject = {
    path: Path.login,
    element: <Login />
}

export default authenticationRoute
