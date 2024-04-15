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
                    <span className='font-mono text-xl font-semibold text-transparent bg-gradient-to-tr from-blue to-[#CF1512] bg-clip-text'>
                        Trang quản lý
                    </span>
                </div>
            </section>
            <section className=''>
                <Select
                    icon={
                        <svg width='17' height='17' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z'
                                fill='currentColor'
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                    }
                    parentData={{ title: 'Tổng Quan', path: `/${route.analytic}` }}
                    childrenData={[
                        { title: 'Phân tích', path: `/${route.analytic}` },
                        { title: 'Quản lý', path: `/${route.profile}` }
                    ]}
                />
                <Select
                    icon={
                        <svg width='17' height='17' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M7.28856 0.796908C7.42258 0.734364 7.57742 0.734364 7.71144 0.796908L13.7114 3.59691C13.8875 3.67906 14 3.85574 14 4.05V10.95C14 11.1443 13.8875 11.3209 13.7114 11.4031L7.71144 14.2031C7.57742 14.2656 7.42258 14.2656 7.28856 14.2031L1.28856 11.4031C1.11252 11.3209 1 11.1443 1 10.95V4.05C1 3.85574 1.11252 3.67906 1.28856 3.59691L7.28856 0.796908ZM2 4.80578L7 6.93078V12.9649L2 10.6316V4.80578ZM8 12.9649L13 10.6316V4.80578L8 6.93078V12.9649ZM7.5 6.05672L12.2719 4.02866L7.5 1.80176L2.72809 4.02866L7.5 6.05672Z'
                                fill='currentColor'
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                    }
                    parentData={{ title: 'Sản Phẩm', path: route.product }}
                />
                <Select
                    icon={
                        <svg width='17' height='17' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z'
                                fill='currentColor'
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                    }
                    parentData={{ title: 'Đơn Hàng', path: route.order }}
                />
                <Select
                    icon={
                        <svg width='17' height='17' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M7.5 0.875C5.49797 0.875 3.875 2.49797 3.875 4.5C3.875 6.15288 4.98124 7.54738 6.49373 7.98351C5.2997 8.12901 4.27557 8.55134 3.50407 9.31167C2.52216 10.2794 2.02502 11.72 2.02502 13.5999C2.02502 13.8623 2.23769 14.0749 2.50002 14.0749C2.76236 14.0749 2.97502 13.8623 2.97502 13.5999C2.97502 11.8799 3.42786 10.7206 4.17091 9.9883C4.91536 9.25463 6.02674 8.87499 7.49995 8.87499C8.97317 8.87499 10.0846 9.25463 10.8291 9.98831C11.5721 10.7206 12.025 11.8799 12.025 13.5999C12.025 13.8623 12.2376 14.0749 12.5 14.0749C12.7623 14.075 12.975 13.8623 12.975 13.6C12.975 11.72 12.4778 10.2794 11.4959 9.31166C10.7244 8.55135 9.70025 8.12903 8.50625 7.98352C10.0187 7.5474 11.125 6.15289 11.125 4.5C11.125 2.49797 9.50203 0.875 7.5 0.875ZM4.825 4.5C4.825 3.02264 6.02264 1.825 7.5 1.825C8.97736 1.825 10.175 3.02264 10.175 4.5C10.175 5.97736 8.97736 7.175 7.5 7.175C6.02264 7.175 4.825 5.97736 4.825 4.5Z'
                                fill='currentColor'
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                    }
                    parentData={{ title: 'Nhân Viên', path: route.employee }}
                />
            </section>
        </nav>
    )
}

export default SideNav
