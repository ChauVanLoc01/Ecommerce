import { Theme } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence } from 'framer-motion'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import 'simplebar-react/dist/simplebar.min.css'
import { Toaster } from 'sonner'
import 'src/reset.css'
import routes, { queryClient } from './routes/main.route'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <AnimatePresence>
            <Theme scaling='110%' radius='large'>
                <RouterProvider router={routes} />
                <Toaster
                    richColors
                    position='top-right'
                    toastOptions={{
                        unstyled: false,
                        classNames: {
                            success: '!bg-blue-50 !text-blue-600 !border-blue-100',
                            error: '!bg-red-50 !text-red-600 !border-red-100',
                            warning: '!bg-orange-50 !text-orange-600 !border-orange-100',
                            info: '!bg-cyan-50 !text-cyan-600 !border-cyan-100',
                            title: '!text-[14px]',
                            description: '!text-[11px] !text-gray-500',
                            actionButton: '!bg-blue-600 !text-white !p-3'
                        }
                    }}
                />
            </Theme>
        </AnimatePresence>
    </QueryClientProvider>
)
