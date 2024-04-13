import { ReactNode } from 'react'

type LayoutProfileProps = {
    title: string
    children: ReactNode
}

const LayoutProfile = ({ title, children }: LayoutProfileProps) => {
    return (
        <div className='grow rounded-8 border border-border/30 bg-white'>
            <section className='border-b border-border/30 font-semibold p-20'>
                {title}
            </section>
            <section className='p-20'>{children}</section>
        </div>
    )
}

export default LayoutProfile
