import { ls } from 'src/utils/localStorage'

export const privateLoader = async () => {
    const profile = ls.getItem('profile')
    if (!profile) {
        throw new Response('Unauthentication', { status: 401 })
    }
    return []
}
