import { ReactNode, createContext, useState } from 'react'
import { OBJECT, RoleType } from 'src/constants/role'
import { Store, User } from 'src/types/auth.type'
import { AppContext as AppContextType } from 'src/types/context.type'
import { ls } from 'src/utils/localStorage'

let profileLS = ls.getItem('profile')
let storeLS = ls.getItem('store')
let roleLS = ls.getItem('role')
let whoLS = ls.getItem('who')

let role = roleLS ? (JSON.parse(roleLS) as RoleType[OBJECT]) : undefined
let profile = profileLS ? (JSON.parse(profileLS) as User) : undefined
let store = storeLS ? (JSON.parse(storeLS) as Store) : undefined

const defaultValueContext: AppContextType = {
    profile,
    setProfile: () => null,
    store,
    setStore: () => null,
    role,
    setRole: () => null,
    who: (whoLS as OBJECT) || undefined,
    setWho: () => null
}

export const AppContext = createContext<AppContextType>(defaultValueContext)

const ContextWrap = ({ children }: { children: ReactNode }) => {
    console.log('App Context load')
    const [store, setStore] = useState<Store | undefined>(defaultValueContext.store)
    const [profile, setProfile] = useState<User | undefined>(defaultValueContext.profile)
    const [role, setRole] = useState<RoleType[OBJECT] | undefined>(defaultValueContext.role)
    const [who, setWho] = useState<OBJECT | undefined>(whoLS as OBJECT | undefined)

    return (
        <AppContext.Provider
            value={{
                profile,
                setProfile,
                store,
                setStore,
                role,
                setRole,
                who,
                setWho
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default ContextWrap
