import { AnimatePresence } from 'framer-motion'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import routes from './routes/main.route'

import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import 'simplebar-react/dist/simplebar.min.css'
import 'src/reset.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AnimatePresence>
        <Theme scaling='110%' radius='large'>
            <RouterProvider router={routes} />
        </Theme>
    </AnimatePresence>
)
