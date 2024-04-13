import { RouteObject } from 'react-router-dom'

import { Path } from 'src/constants/path.enum'
import OverView from 'src/Pages/OverView'

const overViewRoute: RouteObject = {
    path: Path.store,
    element: <OverView />
}

export default overViewRoute
