import { Rate } from 'antd'

const CommentCard = () => {
    return (
        <div className='flex items-start text-xs space-x-4'>
            <section className='rounded-md overflow-hidden w-72 drop-shadow-md'>
                <img
                    src='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e0ab53af-37d7-44ff-846f-868de437ef1d/dg94erf-83e3c25f-d11e-4bb1-a658-7c87d7d2e54a.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2UwYWI1M2FmLTM3ZDctNDRmZi04NDZmLTg2OGRlNDM3ZWYxZFwvZGc5NGVyZi04M2UzYzI1Zi1kMTFlLTRiYjEtYTY1OC03Yzg3ZDdkMmU1NGEuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.yZGsRd_kqzgzw_Eto7Lj-oAL3HVTfv_iAKbpRLL8QwI'
                    alt=''
                    className='object-center'
                />
            </section>
            <section className='grow space-y-2'>
                <div className=''>
                    <h2 className='text-sm text-gray-600'>Chau Van Loc</h2>
                    <div className='flex items-center space-x-2'>
                        <Rate
                            className='text-[12px]'
                            allowHalf
                            defaultValue={2.5}
                        />
                        <span className='text-gray-400 text-[12px]'>
                            22-04-2022
                        </span>
                    </div>
                </div>
                <p className='text-gray-500 line-clamp-4'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quasi explicabo expedita omnis eos odit aliquid quos esse,
                    similique error? Soluta nesciunt qua
                </p>
                <div className='space-x-2 text-[12px] flex'>
                    <button className='shadow-sm hover:bg-gray-50 border border-gray-200 px-2 py-1 rounded-sm'>
                        Pulic Comment
                    </button>
                    <button className='shadow-sm hover:bg-gray-50 border border-gray-200 px-2 py-1 rounded-sm'>
                        Direct Message
                    </button>
                    <button className='shadow-sm hover:bg-gray-50 border border-gray-200 px-2 py-1 rounded-sm group'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={1.5}
                            stroke='currentColor'
                            className='w-3 h-3 group-hover:fill-red-700 group-hover:stroke-none'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'
                            />
                        </svg>
                    </button>
                </div>
            </section>
        </div>
    )
}

export default CommentCard
