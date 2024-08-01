import ls_slim from 'localstorage-slim'

export type key = 'profile' | 'store' | 'access_token' | 'refresh_token' | 'role' | 'who'

export const ls = {
    setItem: (key: key, value: string) => ls_slim.set(key, value),
    getItem: (key: key) => ls_slim.get(key),
    deleteItem: (key: key) => ls_slim.remove(key),
    clearAll: () => ls_slim.clear()
}

export const save_to_ls_when_login = (
    access_token: string,
    refresh_token: string,
    user: any,
    store: any,
    role: any
) => {
    ls_slim.set('access_token', access_token)
    ls_slim.set('refresh_token', refresh_token)
    ls_slim.set('profile', JSON.stringify(user))
    ls_slim.set('store', JSON.stringify(store))
    ls_slim.set('who', role)
}
