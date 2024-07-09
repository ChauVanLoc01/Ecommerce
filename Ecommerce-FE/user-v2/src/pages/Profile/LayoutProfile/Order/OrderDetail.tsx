import { AlertDialog, Avatar, Badge, Button, DataList, Flex, Spinner, Text } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { BiSolidSortAlt } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import Table from 'src/components/Table'
import { OrderStatus } from 'src/constants/order-status'
import { OrderDetailResponse, OrderResponse } from 'src/types/order.type'
import { convertCurrentcy, convertDigitalNumber, removeSpecialCharacter } from 'src/utils/utils.ts'
import OrderFlow from './OrderFlow'
import { AxiosResponse } from 'axios'
import { Return } from 'src/types/return.type'

type OrderDetailProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    orderData?: OrderDetailResponse
    orderRefetch: (options?: RefetchOptions) => Promise<QueryObserverResult<OrderDetailResponse, Error>>
    refetch: (
        options?: RefetchOptions
    ) => Promise<QueryObserverResult<AxiosResponse<Return<OrderResponse>, any>, Error>>
}

const OrderDetail = ({ isOpen, setIsOpen, orderData, refetch, orderRefetch }: OrderDetailProps) => {
    const columns: ColumnDef<OrderDetailResponse['ProductOrder'][number]>[] = [
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
                    <div className='flex items-center gap-x-2 w-48'>
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
                        Giá mua
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
                    {convertCurrentcy(row.original.current_price_after)}
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
            <AlertDialog.Content maxWidth='1200px' className='!rounded-8'>
                <div className='space-y-5'>
                    <AlertDialog.Title>Thông tin chi tiết đơn hàng</AlertDialog.Title>
                    <Flex gapX={'9'}>
                        <div className='flex-basis-1/2 flex-shrink-0'>
                            <DataList.Root id='order-detail-list'>
                                <DataList.Item align='center'>
                                    <DataList.Label minWidth='200px'>Mã đơn hàng</DataList.Label>
                                    <DataList.Value>
                                        <Text>{orderData?.id}</Text>
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item align='center'>
                                    <DataList.Label minWidth='200px'>Trạng thái</DataList.Label>
                                    <DataList.Value>
                                        <div className='text-center'>
                                            <Badge
                                                color={(OrderStatus?.[orderData.status]?.color as any) || 'red'}
                                                size={'3'}
                                            >
                                                {OrderStatus?.[orderData.status]?.label}
                                            </Badge>
                                        </div>
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
                                        <Text>{format(orderData.createdAt, 'HH:mm dd/LL/y')}</Text>
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item align='center'>
                                    <DataList.Label minWidth='200px'>Thời gian hoàn thành</DataList.Label>
                                    <DataList.Value>
                                        <Text>
                                            {orderData.updatedAt ? format(orderData.createdAt, 'HH:mm dd/LL/y') : '_'}
                                        </Text>
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item align='center'>
                                    <DataList.Label minWidth='200px'>Người nhận hàng</DataList.Label>
                                    <DataList.Value>
                                        <Text>{orderData.OrderShipping[0].name}</Text>
                                    </DataList.Value>
                                </DataList.Item>
                                <DataList.Item align='center'>
                                    <DataList.Label minWidth='200px'>Địa chỉ nhận hàng</DataList.Label>
                                    <DataList.Value>
                                        <Text>{orderData.OrderShipping[0].address}</Text>
                                    </DataList.Value>
                                </DataList.Item>
                            </DataList.Root>
                        </div>
                        <div className='basis-1/2 flex-shrink-0 flex-grow'>
                            <OrderFlow orderData={orderData} orderRefetch={orderRefetch} refetch={refetch} />
                        </div>
                    </Flex>
                    <Table<OrderDetailResponse['ProductOrder'][number]>
                        columns={columns}
                        data={orderData.ProductOrder}
                        className='w-full'
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

export default OrderDetail
