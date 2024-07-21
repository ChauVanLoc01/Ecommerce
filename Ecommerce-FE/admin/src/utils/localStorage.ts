export type key = 'profile' | 'store' | 'access_token' | 'refresh_token' | 'role' | 'who'

export const ls = {
    setItem: (key: key, value: string) => localStorage.setItem(key, value),
    getItem: (key: key) => localStorage.getItem(key),
    deleteItem: (key: key) => localStorage.removeItem(key),
    clearAll: () => localStorage.clear()
}

export const save_to_ls_when_login = (
    access_token: string,
    refresh_token: string,
    user: any,
    store: any,
    role: any
) => {
    ls.setItem('access_token', access_token)
    ls.setItem('refresh_token', refresh_token)
    ls.setItem('profile', JSON.stringify(user))
    ls.setItem('store', JSON.stringify(store))
    ls.setItem('who', role)
}
