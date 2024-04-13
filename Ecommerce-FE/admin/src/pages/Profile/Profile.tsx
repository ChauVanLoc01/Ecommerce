import { Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'

import Card from './CardProfile'

const Profile = () => {
    return (
        <section className='flex items-start gap-x-25'>
            <Card rootClassName='basis-1/5' />
            <SimpleBar
                style={{
                    width: '100%',
                    maxHeight: 'calc(100vh - 130px)'
                }}
            >
                <Outlet />
            </SimpleBar>
        </section>
    )
}

export default Profile
