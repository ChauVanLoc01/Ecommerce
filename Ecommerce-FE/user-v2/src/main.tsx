import { AnimatePresence } from 'framer-motion'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import '@radix-ui/themes/layout/components.css'
import '@radix-ui/themes/layout/tokens.css'
import '@radix-ui/themes/layout/utilities.css'
import 'simplebar-react/dist/simplebar.min.css'
import './index.css'
import routes, { queryClient } from './routes/main.route'

import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { setDefaultOptions } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Toaster } from 'src/components/Shadcn/sonner'
import ContextWrap from './contexts/AppContext'
setDefaultOptions({ locale: vi })

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <QueryClientProvider client={queryClient}>
        <Theme radius='large' scaling='110%' accentColor='indigo'>
            <ContextWrap>
                <AnimatePresence mode='popLayout'>
                    <RouterProvider router={routes} />
                </AnimatePresence>
                <ReactQueryDevtools initialIsOpen={false} />
            </ContextWrap>
        </Theme>
        <Toaster
            richColors
            position={['login', 'register'].includes(window.location.href) ? 'top-right' : 'top-center'}
            toastOptions={{
                unstyled: false,
                classNames: {
                    success: '!bg-blue-50 !text-blue-600 !border-blue-100',
                    error: '!bg-red-50 !text-red-600 !border-red-100',
                    warning: '!bg-orange-50 !text-orange-600 !border-orange-100',
                    info: '!bg-cyan-50 !text-cyan-600 !border-cyan-100',
                    title: '!text-[14px]',
                    description: '!text-[11px] !text-gray-500',
                    actionButton: '!bg-blue-600 !text-white !p-3',
                    loading: '!bg-orange-50 !text-orange-500 !border-orange-50'
                }
            }}
        />
    </QueryClientProvider>
)
