import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'

const RejectRoute = () => {
    const { profile } = useContext(AppContext)
    return profile ? <Navigate to={route.analytic} /> : <Outlet />
}

export default RejectRoute
