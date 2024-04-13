import { CiBellOn } from 'react-icons/ci'

const Header = () => {
    return (
        <header className='pt-3 pb-5'>
            <section className='flex items-center justify-end space-x-2'>
                <button className='p-8 hover:bg-bell rounded-8 relative after:w-[16px] after:h-[16px] after:rounded-full after:bg-red after:absolute after:top-2 after:right-2 after:content-["2"] after:text-[10px] after:text-white after:flex after:items-center after:justify-center'>
                    <CiBellOn size={30} />
                </button>
                <button className='rounded-full w-[40px] h-[40px]'>
                    <img
                        src='https://cdn-icons-png.flaticon.com/512/2202/2202112.png'
                        alt='background'
                        className='object-cover'
                    />
                </button>
            </section>
        </header>
    )
}

export default Header
