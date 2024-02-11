import { ReactNode, createContext, useState } from 'react'

import { LocalStorageKey } from 'src/constants/localStorage.enum'

import LS from '../utils/localStorage'

type ContextValueType = {
    isAuth: boolean
    setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
    isLoadingGlobal: boolean
    setIsLoadingGlobal: React.Dispatch<React.SetStateAction<boolean>>
    profile: any
    setProfile: React.Dispatch<any>
}

const defaultValueContext = {
    isAuth: LS.getLS(LocalStorageKey.isAuth)
        ? Boolean(Number(LS.getLS(LocalStorageKey.isAuth)))
        : false,
    setIsAuth: () => null,
    isLoadingGlobal: LS.getLS(LocalStorageKey.isLoadingGlobal)
        ? Boolean(Number(LS.getLS(LocalStorageKey.isLoadingGlobal)))
        : false,
    setIsLoadingGlobal: () => null,
    profile: null,
    setProfile: () => null
}

export const ThemeContext = createContext<ContextValueType>(defaultValueContext)

function AppContext({ children }: { children: ReactNode }) {
    const [isAuth, setIsAuth] = useState<boolean>(defaultValueContext.isAuth)
    const [isLoadingGlobal, setIsLoadingGlobal] = useState<boolean>(
        defaultValueContext.isLoadingGlobal
    )
    const [profile, setProfile] = useState<any>(defaultValueContext.profile)
    return (
        <ThemeContext.Provider
            value={{
                isAuth,
                setIsAuth,
                isLoadingGlobal,
                setIsLoadingGlobal,
                profile,
                setProfile
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export default AppContext
