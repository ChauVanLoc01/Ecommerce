import { Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'

import { motion } from 'framer-motion'

import CardProfile from './CardProfile'

const Profile = () => {
    return (
        <motion.section
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.8 }}
            variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0 }
            }}
            className='flex items-start gap-x-25'
        >
            <CardProfile rootClassName='basis-1/5' />
            <SimpleBar
                style={{
                    width: '100%',
                    maxHeight: 'calc(100vh - 130px)'
                }}
            >
                <Outlet />
            </SimpleBar>
        </motion.section>
    )
}

export default Profile
