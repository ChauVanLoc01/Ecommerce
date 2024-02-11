import { AnimatePresence } from 'framer-motion'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import routes from './routes/main.route'

import 'simplebar-react/dist/simplebar.min.css'
import 'src/reset.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AnimatePresence>
        <RouterProvider router={routes} />
    </AnimatePresence>
)
