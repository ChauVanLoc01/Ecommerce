import { ReactNode, createContext, useState } from 'react'
import { Store, User } from 'src/types/auth.type'
import { AppContext as AppContextType } from 'src/types/context.type'
import { ls } from 'src/utils/localStorage'

const defaultValueContext: AppContextType = {
    profile: ls.getItem('profile') ? (JSON.parse(ls.getItem('profile') as string) as User) : undefined,
    setProfile: () => {},
    store: ls.getItem('store') ? (JSON.parse(ls.getItem('store') as string) as Store) : undefined,
    setStore: () => {}
}

export const AppContext = createContext<AppContextType>(defaultValueContext)

const ContextWrap = ({ children }: { children: ReactNode }) => {
    const [store, setStore] = useState<Store | undefined>(defaultValueContext.store)
    const [profile, setProfile] = useState<User | undefined>(defaultValueContext.profile)

    return (
        <AppContext.Provider
            value={{
                profile,
                setProfile,
                store,
                setStore
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default ContextWrap
