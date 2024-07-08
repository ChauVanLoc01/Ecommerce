import { CounterClockwiseClockIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { BiSolidSortAlt } from 'react-icons/bi'
import { toast } from 'sonner'
import { OrderApi } from 'src/apis/order.api'
import Table from 'src/components/Table'
import { OrderFlowEnum, OrderStatus } from 'src/constants/order.status'
import { Order, OrderQuery } from 'src/types/order.type'
import { convertCurrentcy } from 'src/utils/utils'
import OrderChangeStatus from './OrderFlow/OrderStatus'
import { isAxiosError } from 'axios'

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

    const { refetch: orderDetailRefetch, data: orderDetailData } = useQuery({
        queryKey: ['orderDetail', choosedProduct],
        queryFn: () => OrderApi.getOrderDetail(choosedProduct),
        staleTime: 1000 * 60 * 2,
        enabled: false,
        select: (data) => data.data.result
    })

    const { mutate: updateOrderStatusMutation, isPending: isUpdateing } = useMutation({
        mutationFn: OrderApi.updateStatusOrder(choosedProduct),
        onSuccess: () => {
            handleFetchAll()
            toast.success('Cập nhật trạng thái đơn hàng thành công')
        },
        onError: (err) => {
            if (isAxiosError(err)) {
                toast.error(err.response?.data?.message || 'Cập nhật thất bại')
            }
        }
    })

    const updateStatusOfOrder = (status: OrderFlowEnum, note?: string, orderRefundId?: string) => () => {
        updateOrderStatusMutation({
            status,
            note: '',
            orderRefundId
        })
    }

    const handleChooseProduct = (id: string) => () => {
        setChoosedProduct(id)
    }

    const handleOpenOrderStatus = (type: 'DETAIL' | 'STATUS') => () => {
        switch (type) {
            case 'DETAIL':
                setOpenDetail(true)
                break
            default:
                setOpenChangeStatus(true)
                break
        }
    }

    const handleFetchData = async () => await Promise.all([orderDetailRefetch()])

    const handleFetchAll = async () => {
        await Promise.all([orderListRefetch(), orderDetailRefetch(), analyticOrderStoreRefetching()])
    }

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
                    <Badge color={(OrderStatus?.[row.original.status]?.color as any) || 'red'} size={'3'}>
                        {OrderStatus?.[row.original.status]?.label}
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
                        <Text>{format(row.original.updatedAt, 'hh:mm')}</Text>
                        <Text>{format(row.original.updatedAt, 'dd-MM-yyyy')}</Text>
                    </div>
                ) : (
                    <Text></Text>
                )
            }
        },
        {
            accessorKey: ' ',
            cell: ({ row }) => (
                <Flex gapX={'2'} align={'center'}>
                    <Tooltip content='Xem chi tiết'>
                        <IconButton variant='soft' onMouseOver={handleChooseProduct(row.original.id)}>
                            <InfoCircledIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Trạng thái đơn hàng'>
                        <IconButton
                            variant='soft'
                            color='yellow'
                            onMouseEnter={handleChooseProduct(row.original.id)}
                            onClick={handleOpenOrderStatus('STATUS')}
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
            {orderDetailData && openChangeStatus && (
                <OrderChangeStatus
                    open={openChangeStatus}
                    setOpen={setOpenChangeStatus}
                    handleFetchAll={handleFetchAll as any}
                    orderDetailData={orderDetailData}
                    updateStatusOfOrder={updateStatusOfOrder}
                    isUpdateing={isUpdateing}
                />
            )}
        </>
    )
}

export default OrderTable
