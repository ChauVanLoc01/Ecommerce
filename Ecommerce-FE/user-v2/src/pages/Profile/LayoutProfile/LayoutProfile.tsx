import { ReactNode } from 'react'

import { motion } from 'framer-motion'

type LayoutProfileProps = {
    title: string
    children: ReactNode
}

const LayoutProfile = ({ title, children }: LayoutProfileProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className='grow rounded-8 border border-border/30 bg-white'
        >
            <section className='border-b border-border/30 font-semibold p-20'>
                {title}
            </section>
            <section className='p-20'>{children}</section>
        </motion.div>
    )
}

export default LayoutProfile
