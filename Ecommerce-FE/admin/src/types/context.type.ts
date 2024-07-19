import { ACTION, OBJECT, RoleType, SERVICE } from 'src/constants/role'
import { Store, User } from './auth.type'

export type AppContext = {
    store: Store | undefined
    setStore: React.Dispatch<React.SetStateAction<Store | undefined>>
    profile: User | undefined
    setProfile: React.Dispatch<React.SetStateAction<User | undefined>>
    role: RoleType[OBJECT] | undefined
    setRole: React.Dispatch<React.SetStateAction<Record<Partial<SERVICE>, ACTION[]> | undefined>>
    who?: OBJECT
    setWho: React.Dispatch<React.SetStateAction<OBJECT | undefined>>
}
