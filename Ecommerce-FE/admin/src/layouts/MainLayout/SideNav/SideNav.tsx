import { CubeIcon, FileTextIcon, HomeIcon, IdCardIcon, PersonIcon, StarIcon } from '@radix-ui/react-icons'
import { CiDiscount1 } from 'react-icons/ci'
import Select from 'src/components/Select'

import { side_nav } from 'src/routes/main.route'

const Icon = {
    HomeIcon: <HomeIcon />,
    CiDiscount1: <CiDiscount1 />,
    CubeIcon: <CubeIcon />,
    FileTextIcon: <FileTextIcon />,
    PersonIcon: <PersonIcon />,
    StarIcon: <StarIcon />,
    IdCardIcon: <IdCardIcon />
}

const SideNav = () => {
    return (
        <nav className='p-8 w-[280px] border-r border-r-text_2/30 border-dashed'>
            <section className='pt-3 pb-5'>
                <div className='flex items-center gap-x-2 w-fit mx-auto'>
                    <img
                        src='https://cdn-icons-png.flaticon.com/128/4151/4151729.png'
                        alt='logo'
                        className='object-cover w-10 h-10'
                    />
                    <span className='font-mono text-xl font-semibold text-transparent bg-gradient-to-tr from-blue to-[#CF1512] bg-clip-text'>
                        Trang quản lý
                    </span>
                </div>
            </section>
            <section className=''>
                {side_nav.map(({ label: title, path, icon }) => {
                    return <Select icon={Icon[icon as keyof typeof Icon]} parentData={{ title, path }} />
                })}
            </section>
        </nav>
    )
}

export default SideNav
