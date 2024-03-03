import classNames from 'classnames'

type AddressItemProps = {
    isPrimary?: boolean
    isChecked?: boolean
}

const AddressItem = ({ isPrimary, isChecked }: AddressItemProps) => {
    return (
        <section
            className={classNames(
                'p-24 rounded-8 border border-border/30 space-y-3 relative cursor-pointer hover:border-blue-400',
                {
                    '!border-blue-400 shadow-input bg-blue-50': isChecked
                }
            )}
        >
            <div className='space-y-2'>
                <h3 className='font-semibold'>Chau Van Loc</h3>
                <p className='text-gray-400 text-[13px]'>
                    2D Phung Van Cung, Phu Nhuan, Tp.HCM
                </p>
            </div>
            <div className='text-gray-400 text-[13px]'>0346128692</div>
            <span
                className={classNames(
                    'px-2 py-1 rounded-12 border border-blue-500 text-blue-500 bg-blue-100 text-[10px] tracking-wider absolute -top-1 right-2',
                    {
                        hidden: !isPrimary
                    }
                )}
            >
                Mặc định
            </span>
        </section>
    )
}

export default AddressItem
