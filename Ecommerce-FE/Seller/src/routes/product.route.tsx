import loadable from '@loadable/component'
import { RouteObject } from 'react-router-dom'

import { Path } from 'src/constants/path.enum'

const ProductLazy = loadable(() => import('src/Pages/Product'))

const productRoute: RouteObject = {
    path: Path.product,
    element: <ProductLazy />
}

export default productRoute
