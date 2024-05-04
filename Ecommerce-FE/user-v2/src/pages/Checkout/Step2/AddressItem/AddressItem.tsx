import { Badge, Box, Card, DropdownMenu, IconButton } from '@radix-ui/themes'
import classNames from 'classnames'
import { Delivery } from 'src/types/delivery.type'
import { cn } from 'src/utils/utils.ts'

type AddressItemProps = {
    delivery: Delivery
    isChecked?: boolean
    isDropdown?: boolean
    handleDeleteAddress?: (addressId: string) => () => void
    handleSetDefault?: (addressId: string) => () => void
}

const AddressItem = ({
    delivery,
    isChecked,
    handleDeleteAddress,
    handleSetDefault,
    isDropdown = false
}: AddressItemProps) => {
    return (
        <Card
            className={cn('!rounded-6', {
                '!border-blue-400 shadow-input bg-blue-50': isChecked
            })}
        >
            <div className='space-y-2'>
                <h3 className='font-semibold'>{delivery.full_name}</h3>
                <p className='text-gray-400 text-[13px]'>{delivery.address}</p>
            </div>
            <div className='text-gray-400 text-[13px]'>{delivery.phone}</div>
            <Box className='absolute top-1 right-2 !flex !items-center space-x-1'>
                <Badge
                    color='blue'
                    className={classNames({
                        '!hidden': !delivery.isPrimary
                    })}
                >
                    Mặc định
                </Badge>
                {isDropdown && (
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <IconButton variant='ghost'>
                                <svg
                                    width='15'
                                    height='15'
                                    viewBox='0 0 15 15'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z'
                                        fill='currentColor'
                                        fill-rule='evenodd'
                                        clip-rule='evenodd'
                                    ></path>
                                </svg>
                            </IconButton>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content className='!rounded-8'>
                            <DropdownMenu.Item color='red' onClick={handleDeleteAddress?.(delivery.id)}>
                                Xóa
                            </DropdownMenu.Item>
                            <DropdownMenu.Item>Chỉnh sửa</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item onClick={handleSetDefault?.(delivery.id)}>
                                Đặt làm mặc định
                            </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                )}
            </Box>
        </Card>
    )
}

export default AddressItem
