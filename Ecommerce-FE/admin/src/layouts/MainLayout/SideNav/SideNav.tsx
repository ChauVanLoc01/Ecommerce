import { HomeIcon } from '@radix-ui/react-icons'
import { useContext, useMemo } from 'react'
import { GoStarFill } from 'react-icons/go'
import { IoStorefront, IoTicket } from 'react-icons/io5'
import { MdFlashOn, MdManageAccounts, MdSupervisorAccount } from 'react-icons/md'
import { RiBillFill, RiBox3Fill } from 'react-icons/ri'
import { SiGoogleanalytics } from 'react-icons/si'
import Select from 'src/components/Select'
import { OBJECT, ROLE, SERVICE, SERVICE_NAME } from 'src/constants/role'
import { AppContext } from 'src/contexts/AppContext'

const Icon = {
    MdFlashOn: <MdFlashOn />,
    RiBox3Fill: <RiBox3Fill />,
    RiBillFill: <RiBillFill />,
    MdManageAccounts: <MdManageAccounts />,
    GoStarFill: <GoStarFill />,
    SiGoogleanalytics: <SiGoogleanalytics />,
    MdSupervisorAccount: <MdSupervisorAccount />,
    IoStorefront: <IoStorefront />,
    IoTicket: <IoTicket />
}

const SideNav = () => {
    const { who } = useContext(AppContext)
    const side_navs = useMemo(() => {
        return Object.entries(ROLE[who as OBJECT]).reduce<{ label: string; path: string; icon: string }[]>(
            (acum, [key, value]) => {
                if (value.length) {
                    acum.push(SERVICE_NAME[key as SERVICE])
                    return acum
                }
                return acum
            },
            []
        )
    }, [who])

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
                {side_navs.map(({ label: title, path, icon }) => {
                    return <Select icon={Icon[icon as keyof typeof Icon]} parentData={{ title, path }} />
                })}
            </section>
        </nav>
    )
}

export default SideNav
