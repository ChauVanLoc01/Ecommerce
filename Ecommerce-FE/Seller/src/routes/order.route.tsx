import loadable from '@loadable/component'
import { RouteObject } from 'react-router-dom'

import { Path } from 'src/constants/path.enum'

const OrderLazy = loadable(() => import('../Pages/Order'))

const orderRoute: RouteObject = {
    path: Path.order,
    element: <OrderLazy />
}

export default orderRoute
