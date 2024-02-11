import loadable from '@loadable/component'

export const MainLayout = loadable(() => {
    return import('./MainLayout')
})

MainLayout.load().then(() => {})
