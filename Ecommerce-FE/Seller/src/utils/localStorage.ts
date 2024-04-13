export default {
    getLS: (key: string) => {
        return localStorage.getItem(key)
    },
    setLS: (key: string, value: string | object | []) => {
        return localStorage.setItem(
            key,
            typeof value === 'string' ? value : JSON.stringify(value)
        )
    },
    deleteLS: (key: string) => {
        return localStorage.removeItem(key)
    },
    clearAll: () => {
        return localStorage.clear()
    }
}
