import { useRouteError } from 'react-router-dom'

const RootBoundary = () => {
    const error = useRouteError()
    return <div>RootBoundary</div>
}

export default RootBoundary
