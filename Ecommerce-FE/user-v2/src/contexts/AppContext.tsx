import { ReactNode, createContext, useState } from 'react'
import { LoginResponse } from 'src/types/auth.type'
import { AppContext as AppContextType, ProductContext } from 'src/types/context.type'
import { ls } from 'src/utils/localStorage'

const defaultValueContext: AppContextType = {
    profile: ls.getItem('profile') ? (JSON.parse(ls.getItem('profile') as string) as LoginResponse) : undefined,
    setProfile: () => {},
    products: ls.getItem('products') ? (JSON.parse(ls.getItem('products') as string) as ProductContext[]) : [],
    setProducts: () => {}
}

export const AppContext = createContext<AppContextType>(defaultValueContext)

const ContextWrap = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<AppContextType['profile']>(defaultValueContext.profile)
    const [products, setProducts] = useState<AppContextType['products']>(defaultValueContext.products)

    return (
        <AppContext.Provider
            value={{
                profile,
                setProfile,
                products,
                setProducts
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default ContextWrap
