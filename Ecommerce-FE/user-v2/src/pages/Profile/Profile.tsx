import { Outlet } from 'react-router-dom'

import { motion } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import CardProfile from './CardProfile'

const Profile = () => {
    const { setPreviousPage } = useContext(AppContext)

    useEffect(() => {
        setPreviousPage(route.profile)
    }, [])

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
            <CardProfile rootClassName='flex-shrink-0' />
            <Outlet />
        </motion.section>
    )
}

export default Profile
