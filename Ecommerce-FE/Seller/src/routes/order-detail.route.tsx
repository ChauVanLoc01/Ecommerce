import loadable from '@loadable/component'
import { RouteObject } from 'react-router-dom'

import { Path } from 'src/constants/path.enum'

const OrderDetailLazy = loadable(() => import('src/Pages/OrderDetail'))

const orderDetailRoute: RouteObject = {
    path: `${Path.order}/:orderId`,
    element: <OrderDetailLazy />
}

export default orderDetailRoute
