import { Button, Dialog, Flex, Spinner } from '@radix-ui/themes'
import { UseMutateFunction } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Status } from 'src/constants/product.status'
import { OrderStatus } from 'src/constants/store.constants'
import { Store } from 'src/types/auth.type'

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
    selectedStore: Store | undefined
    isUpdating: boolean
}

const UpdateStatus = ({ open, setOpen, updateStatus, selectedStore, isUpdating }: Props) => {
    let targetStatus: OrderStatus = (selectedStore?.status as OrderStatus) === 'ACTIVE' ? 'BLOCK' : 'ACTIVE'

    let label = selectedStore?.status === Status.active ? 'Khóa cửa hàng' : 'Mở khóa cửa hàng'
    let description =
        selectedStore?.status === Status.active
            ? 'Cửa hàng này sẽ không thể tiếp tục bán hàng trên nền tảng của bạn nửa? Xác nhận thực hiện?'
            : 'Cửa hàng này sẽ được bán với tất cả người dùng trên hệ thống? Xác nhận thực hiện?'

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content maxWidth='600px' className='rounded-8'>
                <Dialog.Title>{label}</Dialog.Title>
                <Dialog.Description size='2' mb='4'>
                    {description}
                </Dialog.Description>

                <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                        <Button variant='soft' color='gray' type='button' className='text-red px-3 py-1.5'>
                            Trở về
                        </Button>
                    </Dialog.Close>
                    <Button
                        className='bg-blue text-white px-3 py-1.5'
                        onClick={() => updateStatus({ status: targetStatus })}
                    >
                        {isUpdating && <Spinner />}
                        Cập nhật
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default UpdateStatus
