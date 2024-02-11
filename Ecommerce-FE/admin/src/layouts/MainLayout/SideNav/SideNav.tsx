import { BiHomeHeart } from 'react-icons/bi'

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
                    <span className='font-mono text-xl font-semibold text-blue'>
                        Trang quản lý
                    </span>
                </div>
            </section>
            <section className=''>
                <Select
                    icon={<BiHomeHeart />}
                    parentData={{ title: 'Cửa hàng' }}
                    childrenData={[
                        { title: 'Phân tích', path: route.analytic },
                        { title: 'Quản lý', path: route.profile }
                    ]}
                />
                <Select
                    icon={<BiHomeHeart />}
                    parentData={{ title: 'Sản phẩm' }}
                    childrenData={[
                        { title: 'Phân tích', path: route.analytic },
                        { title: 'Quản lý', path: route.profile }
                    ]}
                />
            </section>
        </nav>
    )
}

export default SideNav
