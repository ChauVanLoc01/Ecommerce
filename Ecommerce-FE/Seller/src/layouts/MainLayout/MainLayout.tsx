import { useEffect, useRef, useState } from 'react'

import { motion } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import SimpleBar from 'simplebar-react'

import 'simplebar-react/dist/simplebar.min.css'

import Header from 'src/Components/Header'
import Sidebar from 'src/Components/Sidebar'

function MainLayout() {
    const [maxHeight, setMaxHeight] = useState<number>(0)
    const crollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (crollRef?.current) {
            setMaxHeight(window.innerHeight - crollRef.current.offsetHeight)
        }
    }, [crollRef])

    return (
        <div className='text-base max-h-screen overflow-hidden'>
            <Header ref={crollRef} />
            <main className='flex'>
                <motion.section
                    className='basis-2/12'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Sidebar />
                </motion.section>
                <SimpleBar
                    style={{
                        maxHeight: `${maxHeight}px`,
                        height: `${maxHeight}px`,
                        backgroundColor: '#F8F8FB',
                        flexGrow: 1,
                        padding: '15px'
                    }}
                >
                    <Outlet context={maxHeight} />
                </SimpleBar>
            </main>
        </div>
    )
}

export default MainLayout
