import { Outlet } from 'react-router-dom'

import Card from './CardProfile'

const Profile = () => {
    return (
        <section className='flex items-start gap-x-25'>
            <Card />
            <div className='flex-grow'>
                <Outlet />
            </div>
        </section>
    )
}

export default Profile
