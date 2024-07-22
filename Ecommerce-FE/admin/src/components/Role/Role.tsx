import { ReactNode, useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { OBJECT } from 'src/constants/role'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'

type RoleProps = {
    type: OBJECT[]
    children: ReactNode
}

const Role = ({ children, type }: RoleProps) => {
    const { who } = useContext(AppContext)
    let isCan = type.includes(who as OBJECT)
    if (!isCan) {
        return <Navigate to={route.permission} />
    }
    return children
}

// Only One
const AdminAuth = ({ children }: Pick<RoleProps, 'children'>) => {
    return <Role type={['ADMIN']} children={children} />
}

const StoreOwnerAuth = ({ children }: Pick<RoleProps, 'children'>) => {
    return <Role type={['STORE_OWNER']} children={children} />
}

const EmployeeAuth = ({ children }: Pick<RoleProps, 'children'>) => {
    return <Role type={['EMPLOYEE']} children={children} />
}

// Combine

const AdminAndStoreOwnerAuth = ({ children }: Pick<RoleProps, 'children'>) => {
    return <Role type={['ADMIN', 'STORE_OWNER']} children={children} />
}

const StoreOwnerAndEmployeeAuth = ({ children }: Pick<RoleProps, 'children'>) => {
    return <Role type={['EMPLOYEE', 'STORE_OWNER']} children={children} />
}

export { AdminAndStoreOwnerAuth, AdminAuth, EmployeeAuth, StoreOwnerAndEmployeeAuth, StoreOwnerAuth }
