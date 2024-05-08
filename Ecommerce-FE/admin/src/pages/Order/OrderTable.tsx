import { Cross2Icon, InfoCircledIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BiSolidSortAlt } from 'react-icons/bi'
import { OrderApi } from 'src/apis/order.api'
import Table from 'src/components/Table'
import { OrderStatus } from 'src/constants/order.status'
import { Order } from 'src/types/order.type'
import { convertCurrentcy } from 'src/utils/utils'

const OrderTable = () => {
    const { data, refetch } = useQuery({
        queryKey: ['orderList', JSON.stringify({ limit: import.meta.env.VITE_LIMIT })],
        queryFn: () => OrderApi.getAllOrder({ limit: import.meta.env.VITE_LIMIT }),
        staleTime: 1000 * 60 * 2,
        enabled: false,
        placeholderData: (oldData) => oldData,
        select: (data) => data.data
    })

    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: 'Mã đơn',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly max-w-28'>
                        Mã đơn
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Text className='!max-w-28 line-clamp-1'>{row.original.id}</Text>
        },
        {
            accessorKey: 'Trạng thái',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Trạng thái
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='text-center'>
                    <Badge color={OrderStatus[row.original.status].color as any}>
                        {OrderStatus[row.original.status].lable}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'Tổng tiền',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Tổng tiền
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='text-center'>
                    <Text>{convertCurrentcy(row.original.total)}</Text>
                </div>
            )
        },
        {
            accessorKey: 'Giảm giá',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Giảm giá
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='text-center'>
                    <Text>{convertCurrentcy(row.original.discount)}</Text>
                </div>
            )
        },
        {
            accessorKey: 'Tổng thanh toán',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Tổng thanh toán
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='text-center'>
                    <Text>{convertCurrentcy(row.original.pay)}</Text>
                </div>
            )
        },
        {
            accessorKey: 'Thời gian tạo',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Thời gian tạo
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='lowercase flex flex-col items-center'>
                    <span className='italic text-gray-400 text-[14px]'>
                        {formatDistance(row.original.createdAt, new Date().toISOString(), {
                            addSuffix: true,
                            locale: vi
                        })}
                    </span>
                    <span>{format(row.original.createdAt, 'hh:mm dd-MM-yyyy')}</span>
                </div>
            )
        },
        {
            accessorKey: 'Cập nhật lúc',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Cập nhật lúc
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => {
                row.original.updatedAt ? (
                    <div className='lowercase flex flex-col items-center'>
                        <span>{format(row.original.updatedAt, 'hh:mm')}</span>
                        <span>{format(row.original.updatedAt, 'dd-MM-yyyy')}</span>
                    </div>
                ) : (
                    <Text>_</Text>
                )
            }
        },
        {
            accessorKey: ' ',
            cell: ({ row }) => (
                <Flex gapX={'2'} align={'center'}>
                    <Tooltip content='Xem chi tiết'>
                        <IconButton variant='soft'>
                            <InfoCircledIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Chỉnh sửa'>
                        <IconButton
                            variant='soft'
                            color='orange'
                            disabled={['CANCEL', 'SUCCESS'].includes(row.original.status)}
                        >
                            <Pencil1Icon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Hủy đơn'>
                        <IconButton
                            variant='soft'
                            color='red'
                            disabled={['CANCEL', 'SUCCESS'].includes(row.original.status)}
                        >
                            <Cross2Icon />
                        </IconButton>
                    </Tooltip>
                </Flex>
            )
        }
    ]

    return (
        <Table<Order> columns={columns} data={data?.result.data ?? []} tableMaxHeight='600px' className='w-[1500px]' />
    )
}

export default OrderTable
