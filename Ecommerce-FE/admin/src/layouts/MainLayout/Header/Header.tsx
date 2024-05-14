import { Avatar, DropdownMenu, IconButton } from '@radix-ui/themes'
import { CiBellOn } from 'react-icons/ci'
import { resolvePath, useNavigate } from 'react-router-dom'
import { exitEvent } from 'src/constants/event.constants'
import { route } from 'src/constants/route'

const Header = () => {
    const navigate = useNavigate()

    const handleExist = () => {
        window.dispatchEvent(new Event(exitEvent))
    }

    return (
        <header className='pt-3 pb-5'>
            <section className='flex items-center justify-end space-x-2'>
                <button className='p-8 hover:bg-bell rounded-8 relative after:w-[16px] after:h-[16px] after:rounded-full after:bg-red after:absolute after:top-2 after:right-2 after:content-["2"] after:text-[10px] after:text-white after:flex after:items-center after:justify-center'>
                    <CiBellOn size={30} />
                </button>
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <IconButton variant='soft' className='!outline-none'>
                            <Avatar
                                src='https://cdn-icons-png.flaticon.com/512/2202/2202112.png'
                                fallback='A'
                                radius='full'
                                size='3'
                            />
                        </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className='!rounded-8 !mt-2' align='end'>
                        <DropdownMenu.Item onClick={() => navigate(resolvePath(route.profile, route.root).pathname)}>
                            Thông tin cá nhân
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onClick={handleExist}>Đăng xuất</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </section>
        </header>
    )
}

export default Header
