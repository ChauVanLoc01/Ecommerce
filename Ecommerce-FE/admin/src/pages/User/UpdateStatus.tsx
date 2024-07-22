import { CopyIcon } from '@radix-ui/react-icons'
import { Avatar, Box, Button, Card, Code, Dialog, Flex, IconButton, Skeleton, Spinner, Text } from '@radix-ui/themes'
import { UseMutateFunction, useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { user_api } from 'src/apis/user.api'
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

    const { data: isThereStore, isPending } = useQuery({
        queryKey: ['is_there_store', selectedUser?.id],
        queryFn: user_api.isThereStore(selectedUser?.id || ''),
        select: (data) => data.data.result
    })

    console.log('isPending', isPending)

    const StoreExist = isThereStore && (
        <div className='space-y-2'>
            <Text size={'2'} color='red'>
                Người dùng này có cửa hàng trên nền tảng của bạn
            </Text>
            <Box maxWidth='240px'>
                <Card>
                    <Flex gap='3' align='center'>
                        <Avatar size='3' src={isThereStore.image} radius='full' fallback={isThereStore.name} />
                        <Box>
                            <Text as='div' size='2' weight='bold'>
                                {isThereStore.name}
                            </Text>
                            <Flex align={'center'} gapX={'2'}>
                                <Code size='2' color='gray' className='line-clamp-1'>
                                    {isThereStore.id}
                                </Code>
                                <IconButton size='1' aria-label='Copy value' color='gray' variant='ghost'>
                                    <CopyIcon />
                                </IconButton>
                            </Flex>
                        </Box>
                    </Flex>
                </Card>
            </Box>
        </div>
    )

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content maxWidth='600px' className='rounded-8'>
                <Dialog.Title>{label}</Dialog.Title>
                <Dialog.Description size='2' mb='4'>
                    {description}
                </Dialog.Description>

                {isPending ? (
                    <Box maxWidth='240px'>
                        <Card>
                            <Flex gap='3' align='center'>
                                <Skeleton width={'45px'} height={'45px'} className='flex-shrink-0 rounded-full' />
                                <Box>
                                    <Skeleton>Teodros Girmay</Skeleton>
                                    <Skeleton />
                                </Box>
                            </Flex>
                        </Card>
                    </Box>
                ) : (
                    StoreExist
                )}

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
