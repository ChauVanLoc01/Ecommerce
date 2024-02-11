import { RouteObject } from 'react-router-dom'

import { Path } from 'src/constants/path.enum'
import { Profile } from 'src/Pages/Profile'

const profileRoute: RouteObject = {
    path: Path.profile,
    element: <Profile />
}

export default profileRoute
