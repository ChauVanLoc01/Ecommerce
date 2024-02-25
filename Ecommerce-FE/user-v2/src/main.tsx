import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import routes from './routes/main.route'
import './index.css'
import 'simplebar-react/dist/simplebar.min.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={routes} />
)
