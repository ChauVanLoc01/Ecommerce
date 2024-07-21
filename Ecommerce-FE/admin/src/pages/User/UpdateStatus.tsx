import { Button, Dialog, Flex, Spinner } from '@radix-ui/themes'
import { UseMutateFunction } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { OrderStatus } from 'src/constants/store.constants'
import { User } from 'src/types/auth.type'

type Props = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    updateStatus: UseMutateFunction<
        AxiosResponse<any, any>,
        Error,
        {
            status: OrderStatus
        },
        unknown
    >
    selectedUser?: User
    isUpdating: boolean
}

const UpdateStatus = ({ open, setOpen, updateStatus, selectedUser, isUpdating }: Props) => {
    let isActive = (selectedUser?.status as OrderStatus) === 'ACTIVE'
    let targetStatus: OrderStatus = isActive ? 'BLOCK' : 'ACTIVE'

    let label = isActive ? 'Khóa người dùng' : 'Mở khóa người dùng'
    let description = !isActive
        ? 'Người dùng sẽ có thể mua sắm trên nền tảng của bạn? Xác nhận thực hiện?'
        : 'Người dùng sẽ không thể truy cập và mua hàng trên nền tảng của bạn? Xác nhận thực hiện?'

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content maxWidth='600px' className='rounded-8'>
                <Dialog.Title>{label}</Dialog.Title>
                <Dialog.Description size='2' mb='4'>
                    {description}
                </Dialog.Description>

                <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                        <Button variant='soft' color='gray' type='button' className='text-red'>
                            Trở về
                        </Button>
                    </Dialog.Close>
                    <Button
                        className='bg-blue text-white px-3 py-1.5'
                        onClick={() => updateStatus({ status: targetStatus })}
                    >
                        {isUpdating && <Spinner />}
                        Xác nhận
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default UpdateStatus
