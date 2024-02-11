import loadable from '@loadable/component'
import { RouteObject } from 'react-router-dom'

import { Path } from 'src/constants/path.enum'

const ViewsLazy = loadable(() => import('src/Pages/Views'))

const viewRoute: RouteObject = {
    path: Path.reviews,
    element: <ViewsLazy />
}

export default viewRoute
