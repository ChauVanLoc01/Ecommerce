import classNames from 'classnames'
import { Delivery } from 'src/types/delivery.type'

type AddressItemProps = {
    delivery: Delivery
    isChecked?: boolean
}

const AddressItem = ({ delivery, isChecked }: AddressItemProps) => {
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
                <h3 className='font-semibold'>{delivery.full_name}</h3>
                <p className='text-gray-400 text-[13px]'>{delivery.address}</p>
            </div>
            <div className='text-gray-400 text-[13px]'>{delivery.phone}</div>
            <span
                className={classNames(
                    'px-2 py-1 rounded-12 border border-blue-500 text-blue-500 bg-blue-100 text-[10px] tracking-wider absolute -top-1 right-2',
                    {
                        hidden: !delivery.isPrimary
                    }
                )}
            >
                Mặc định
            </span>
        </section>
    )
}

export default AddressItem
