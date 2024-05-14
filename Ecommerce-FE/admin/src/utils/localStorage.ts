export type key = 'profile' | 'store' | 'access_token' | 'refresh_token'

export const ls = {
    setItem: (key: key, value: string) => localStorage.setItem(key, value),
    getItem: (key: key) => localStorage.getItem(key),
    deleteItem: (key: key) => localStorage.removeItem(key),
    clearAll: () => localStorage.clear()
}
