import { CounterClockwiseClockIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { compareAsc, format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { BiSolidSortAlt } from 'react-icons/bi'
import { OrderApi } from 'src/apis/order.api'
import Table from 'src/components/Table'
import { OrderStatus } from 'src/constants/order.status'
import { Order, OrderQuery } from 'src/types/order.type'
import { convertCurrentcy } from 'src/utils/utils'
import OrderChangeStatus from './OrderStatus'

type OrderTableProps = {
    data: Order[]
    orderListRefetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
            {
                data: Order[]
                query: Omit<OrderQuery, 'page'> & {
                    page: number
                    page_size: number
                }
            },
            Error
        >
    >
    analyticOrderStoreRefetching: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
            {
                all: number
                success: number
                waiting_confirm: number
                shipping: number
                cancel: number
            },
            Error
        >
    >
}

const OrderTable = ({ data, orderListRefetch, analyticOrderStoreRefetching }: OrderTableProps) => {
    const [openDetail, setOpenDetail] = useState<boolean>(false)
    const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false)
    const [choosedProduct, setChoosedProduct] = useState<string>('')

    console.log(openDetail);

    const {
        refetch: orderDetailRefetch,
    } = useQuery({
        queryKey: ['orderDetail', choosedProduct],
        queryFn: () => OrderApi.getOrderDetail(choosedProduct),
        staleTime: 1000 * 60 * 3,
        enabled: false
    })

    const { refetch: orderStatusRefetch, data: orderStatusData } = useQuery({
        queryKey: ['orderStatus', choosedProduct],
        queryFn: () => OrderApi.getOrderStatus(choosedProduct),
        staleTime: 1000 * 60 * 3,
        enabled: false,
        select: (data) => data.data.result
    })

    const handleChooseProduct = (type: 'DETAIL' | 'STATUS', id: string) => () => {
        setChoosedProduct(id)
        switch (type) {
            case 'DETAIL':
                setOpenDetail(true)
                break
            default:
                setOpenChangeStatus(true)
                break
        }
    }

    const handleFetchData = async () => await Promise.all([orderDetailRefetch(), orderStatusRefetch()])

    const handleFetchAll = async () =>
        await Promise.all([
            orderListRefetch(),
            orderDetailRefetch(),
            orderStatusRefetch(),
            analyticOrderStoreRefetching()
        ])

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
                        <IconButton variant='soft' onClick={handleChooseProduct('DETAIL', row.original.id)}>
                            <InfoCircledIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Trạng thái đơn hàng'>
                        <IconButton
                            variant='soft'
                            color='yellow'
                            onClick={handleChooseProduct('STATUS', row.original.id)}
                        >
                            <CounterClockwiseClockIcon />
                        </IconButton>
                    </Tooltip>
                </Flex>
            )
        }
    ]

    useEffect(() => {
        if (choosedProduct) {
            handleFetchData()
        }
    }, [choosedProduct])

    return (
        <>
            <Table<Order> columns={columns} data={data} tableMaxHeight='500px' className='w-[1500px]' />
            {/* <OrderDetail open={openDetail} setOpen={setOpenDetail} data={orderDetailData ?? []} /> */}
            <OrderChangeStatus
                open={openChangeStatus}
                setOpen={setOpenChangeStatus}
                handleFetchAll={handleFetchAll as any}
                orderId={choosedProduct}
                data={orderStatusData ? orderStatusData?.sort((a, b) => compareAsc(a.createdAt, b.createdAt)) : []}
            />
        </>
    )
}

export default OrderTable
