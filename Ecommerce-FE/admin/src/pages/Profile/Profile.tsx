import { Outlet } from 'react-router-dom'

import Card from './CardProfile'

const Profile = () => {
    return (
        <div className='flex items-start gap-x-25'>
            <Card rootClassName='basis-1/5' />
            <Outlet />
        </div>
    )
}

export default Profile
