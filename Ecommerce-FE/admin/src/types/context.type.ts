import { Store, User } from './auth.type'

export type AppContext = {
    store: Store | undefined
    setStore: React.Dispatch<React.SetStateAction<Store | undefined>>
    profile: User | undefined
    setProfile: React.Dispatch<React.SetStateAction<User | undefined>>
}
