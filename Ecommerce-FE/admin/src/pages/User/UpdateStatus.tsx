import { Button, Dialog, Flex } from '@radix-ui/themes'
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
    selectedUser: User | undefined
}

const UpdateStatus = ({ open, setOpen, updateStatus, selectedUser }: Props) => {
    let targetStatus: OrderStatus = (selectedUser?.status as OrderStatus) === 'ACTIVE' ? 'BLOCK' : 'ACTIVE'

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content maxWidth='600px' className='rounded-8'>
                <Dialog.Title>Cập nhật trạng thái cửa hàng</Dialog.Title>
                <Dialog.Description size='2' mb='4'>
                    Cửa hàng này sẽ không thể tiếp tục bán hàng trên nền tảng của bạn nửa? Bạn có chắc muốn làm điều
                    này?
                </Dialog.Description>

                <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                        <Button variant='soft' color='gray' type='button'>
                            Trở về
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button onClick={() => updateStatus({ status: targetStatus })}>Cập nhật</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default UpdateStatus
