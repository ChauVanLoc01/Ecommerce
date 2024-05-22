import { CubeIcon, FileTextIcon, HomeIcon, IdCardIcon, PersonIcon, StarIcon } from '@radix-ui/react-icons'
import Select from 'src/components/Select'

import { route } from 'src/constants/route'

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
                <Select
                    icon={<HomeIcon className='w-4 h-4' />}
                    parentData={{ title: 'Tổng Quan', path: `/${route.analytic}` }}
                />
                <Select
                    icon={<CubeIcon className='w-4 h-4' />}
                    parentData={{ title: 'Sản Phẩm', path: route.product }}
                />
                <Select
                    icon={<FileTextIcon className='w-4 h-4' />}
                    parentData={{ title: 'Đơn Hàng', path: route.order }}
                />
                <Select
                    icon={<PersonIcon className='w-4 h-4' />}
                    parentData={{ title: 'Nhân Viên', path: route.employee }}
                />
                <Select
                    icon={<StarIcon className='w-4 h-4' />}
                    parentData={{ title: 'Đánh giá', path: route.rating }}
                />
                <Select
                    icon={<IdCardIcon className='w-4 h-4' />}
                    parentData={{ title: 'Mã giảm giá', path: route.voucher }}
                />
            </section>
        </nav>
    )
}

export default SideNav
