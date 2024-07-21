import { CopyIcon } from '@radix-ui/react-icons'
import { Avatar, Badge, Button, Code, DataList, Dialog, Flex, IconButton, Spinner, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { format, formatDistanceToNow } from 'date-fns'
import { store_api } from 'src/apis/store.api'
import { formatDefault } from 'src/constants/date.constants'
import { OrderColor, OrderLabel, OrderStatus } from 'src/constants/store.constants'
import { Store } from 'src/types/auth.type'
import { convertCurrentcy } from 'src/utils/utils'

type Props = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedStore: Store | undefined
}

const Detail = ({ open, setOpen, selectedStore }: Props) => {
    if (!selectedStore) return

    const { data: store_detail } = useQuery({
        queryKey: ['store-detail', selectedStore.id],
        queryFn: store_api.getDetail(selectedStore.id),
        staleTime: 1000 * 60,
        select: (data) => data.data.result
    })

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content maxWidth='600px' className='rounded-8'>
                <Dialog.Title>Chi tiết cửa hàng</Dialog.Title>
                <DataList.Root>
                    <DataList.Item>
                        <DataList.Label>Hình ảnh</DataList.Label>
                        <DataList.Value>
                            <Avatar fallback='store-detail' src={selectedStore.image} size={'5'} />
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Mã cửa hàng</DataList.Label>
                        <DataList.Value>
                            <Flex align='center' gap='2'>
                                <Code variant='ghost'>u_2J89JSA4GJ</Code>
                                <IconButton size='1' aria-label='Copy value' color='gray' variant='ghost'>
                                    <CopyIcon />
                                </IconButton>
                            </Flex>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Tên cửa hàng</DataList.Label>
                        <DataList.Value>{selectedStore.name}</DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Địa chỉ</DataList.Label>
                        <DataList.Value>{selectedStore.location}</DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Status</DataList.Label>
                        <DataList.Value>
                            <Badge size={'3'} color={OrderColor[selectedStore.status as OrderStatus]}>
                                {OrderLabel[selectedStore.status as OrderStatus]}
                            </Badge>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Số lượng sản phẩm</DataList.Label>
                        <DataList.Value>
                            {!store_detail ? <Spinner /> : convertCurrentcy(store_detail.product_count, false)}
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Số lượng nhân viên</DataList.Label>
                        <DataList.Value>
                            {!store_detail ? <Spinner /> : convertCurrentcy(store_detail.employee_count, false)}
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label>Thời gian tạo</DataList.Label>
                        <DataList.Value>
                            <Flex align={'center'} gapX={'3'}>
                                <Text>{format(selectedStore.createdAt, formatDefault)}</Text>
                                <Text className='text-gray-400'>({formatDistanceToNow(selectedStore.createdAt)})</Text>
                            </Flex>
                        </DataList.Value>
                    </DataList.Item>
                </DataList.Root>

                <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                        <Button variant='soft' type='button' className='bg-blue text-white'>
                            Trở về
                        </Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default Detail
