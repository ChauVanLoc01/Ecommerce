import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AppContext } from 'src/contexts/AppContext'

const PrivateRoute = () => {
    const { who } = useContext(AppContext)
    return who ? <Outlet /> : <Navigate to={'/login'} />
}

export default PrivateRoute
