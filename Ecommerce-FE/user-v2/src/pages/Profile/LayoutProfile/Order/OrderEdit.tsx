import { AlertDialog, Avatar, Badge, Button, DataList, Flex, Spinner, Text } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { BiSolidSortAlt } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom'
import Table from 'src/components/Table'
import { OrderStatus } from 'src/constants/order-status'
import { OrderDetailResponse, ProductOrderWithProduct } from 'src/types/order.type'
import { convertCurrentcy, convertDigitalNumber, removeSpecialCharacter } from 'src/utils/utils.ts'

type OrderDetailProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: ProductOrderWithProduct[]
    orderData?: OrderDetailResponse
}

const OrderEdit = ({ isOpen, setIsOpen, data, orderData }: OrderDetailProps) => {
    const navigate = useNavigate()

    const columns: ColumnDef<ProductOrderWithProduct>[] = [
        {
            accessorKey: 'Hình ảnh',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Hình ảnh
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Avatar size={'5'} src={row.original.image} fallback='A' />
        },
        {
            accessorKey: 'Tên sản phẩm',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2 w-30'>
                        Tên sản phẩm
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Link
                    to={`/${removeSpecialCharacter(row.original.name)}-0-${row.original.productId}`}
                    className='inline-block w-48'
                >
                    {row.original.name}
                </Link>
            )
        },
        {
            accessorKey: 'Số lượng mua',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2 line-clamp-2'>
                        Số lượng mua
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Text className='!text-center' as='div'>
                    {convertDigitalNumber(row.original.quantity)}
                </Text>
            )
        },
        {
            accessorKey: 'Giá chưa giảm',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Giá chưa giảm
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Text className='!text-center' as='div'>
                    {row.original.priceBefore ? convertCurrentcy(row.original.priceBefore) : ''}
                </Text>
            )
        },
        {
            accessorKey: 'Giá đã giảm',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Giá đã giảm
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Text className='!text-center' as='div'>
                    {convertCurrentcy(row.original.priceAfter)}
                </Text>
            )
        },
        {
            accessorKey: 'Giá sản phẩm hiện tại',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Giá sản phẩm hiện tại
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Text className='!text-center' as='div'>
                    {convertCurrentcy(row.original.currentPriceAfter)}
                </Text>
            )
        },
        {
            accessorKey: 'Tổng tiền',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Tổng tiền
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Text className='!text-center' as='div'>
                    {convertCurrentcy(row.original.priceAfter * row.original.quantity)}
                </Text>
            )
        }
    ]

    if (!orderData) {
        return (
            <AlertDialog.Root>
                <AlertDialog.Content>
                    <AlertDialog.Title>Thông tin chi tiết đơn hàng</AlertDialog.Title>
                    <Spinner />
                </AlertDialog.Content>
            </AlertDialog.Root>
        )
    }

    return (
        <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialog.Content maxWidth='900px' className='!rounded-8'>
                <div className='space-y-5'>
                    <AlertDialog.Title>Cập nhật đơn hàng</AlertDialog.Title>
                    <DataList.Root>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='200px'>Mã đơn hàng</DataList.Label>
                            <DataList.Value>
                                <Text>{orderData?.id}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='200px'>Trạng thái</DataList.Label>
                            <DataList.Value>
                                <Badge size={'3'} color={OrderStatus[orderData?.status][1] as any}>
                                    {OrderStatus[orderData?.status][0]}
                                </Badge>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='200px'>Tổng tiền</DataList.Label>
                            <DataList.Value>
                                <Text>{convertCurrentcy(orderData.total)}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='200px'>Giảm giá</DataList.Label>
                            <DataList.Value>
                                <Text>{convertCurrentcy(orderData.discount)}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='200px'>Tổng tiền phải trả</DataList.Label>
                            <DataList.Value>
                                <Text>{convertCurrentcy(orderData.pay)}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='200px'>Thời gian đặt hàng</DataList.Label>
                            <DataList.Value>
                                <Text>{format(orderData.createdAt, 'HH:mm dd/LL/Y')}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='200px'>Thời gian hoàn thành</DataList.Label>
                            <DataList.Value>
                                <Text>{orderData.updatedAt ? format(orderData.createdAt, 'HH:mm dd/LL/Y') : '_'}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='200px'>Người nhận hàng</DataList.Label>
                            <DataList.Value>
                                <Text>{orderData.delivery.full_name}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='200px'>Địa chỉ nhận hàng</DataList.Label>
                            <DataList.Value>
                                <Text>{orderData.delivery.address}</Text>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                    <Table<ProductOrderWithProduct>
                        columns={columns}
                        data={data}
                        className='w-[1400px]'
                        tableMaxHeight='300px'
                    />
                    <Flex gap='3' mt='4' justify='end'>
                        <AlertDialog.Cancel>
                            <Button>Trở về</Button>
                        </AlertDialog.Cancel>
                    </Flex>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default OrderEdit
