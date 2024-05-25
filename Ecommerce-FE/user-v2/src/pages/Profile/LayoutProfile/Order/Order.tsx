import { ChevronLeftIcon, ChevronRightIcon, Cross2Icon, InfoCircledIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { AlertDialog, Badge, Button, Flex, IconButton, Select, Text, TextField, Tooltip } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { add, endOfDay, format, startOfDay } from 'date-fns'
import { isUndefined, omit, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { BiSolidSortAlt } from 'react-icons/bi'
import { OrderFetching } from 'src/apis/order'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import Table from 'src/components/Table'
import { OrderStatus } from 'src/constants/order-status'
import { OrderQuery, Order as OrderType } from 'src/types/order.type'
import { convertCurrentcy } from 'src/utils/utils.ts'
import LayoutProfile from '../LayoutProfile'
import OrderCancel from './OrderCancel'
import OrderDetail from './OrderDetail'
import OrderEdit from './OrderEdit'

const Order = () => {
    const [date, setDate] = useState<DateRange | undefined>(undefined)
    const [query, setQuery] = useState<Partial<OrderQuery>>({ createdAt: 'desc' })
    const [openDetail, setOpenDetail] = useState<boolean>(false)
    const [openEdit, setOpenEdit] = useState<boolean>(false)
    const [openCancel, setOpenCancel] = useState<boolean>(false)
    const [orderId, setOrderId] = useState<string>('')

    const columns: ColumnDef<OrderType>[] = [
        {
            accessorKey: 'Mã đơn hàng',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2 line-clamp-1 w-28'>
                        Mã đơn hàng
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <div className='line-clamp-1 w-28'>{row.original.id}</div>
        },
        {
            accessorKey: 'Trạng thái',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Trạng thái
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Badge size={'3'} color={OrderStatus[row.original.status][1] as any}>
                    {OrderStatus[row.original.status][0]}
                </Badge>
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
            cell: ({ row }) => <div className='capitalize'>{convertCurrentcy(row.original.total)}</div>
        },
        {
            accessorKey: 'Giảm giá',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Giảm giá
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <div className='capitalize'>{convertCurrentcy(row.original.discount)}</div>
        },
        {
            accessorKey: 'Số tiền cần trả',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Số tiền cần trả
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <div className='capitalize'>{convertCurrentcy(row.original.pay)}</div>
        },
        {
            accessorKey: 'Thời gian tạo',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Thời gian tạo
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Flex align={'center'} justify={'center'} direction={'column'}>
                    <Text>{format(row.original.createdAt, 'HH:mm')}</Text>
                    <Text>{format(row.original.createdAt, 'dd/LL/Y')}</Text>
                </Flex>
            )
        },
        {
            accessorKey: ' ',
            cell: ({ row }) => (
                <Flex gapX={'2'} align={'center'}>
                    <Tooltip content='Xem chi tiết'>
                        <IconButton
                            variant='soft'
                            onClick={() => setOpenDetail(!openDetail)}
                            onMouseEnter={handleFetchOrderDetailWhenHovering(row.original.id)}
                        >
                            <InfoCircledIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Chỉnh sửa'>
                        <IconButton
                            variant='soft'
                            color='orange'
                            onClick={() => setOpenEdit(!openEdit)}
                            onMouseEnter={handleFetchOrderDetailWhenHovering(row.original.id)}
                            disabled={['CANCEL', 'SUCCESS'].includes(row.original.status)}
                        >
                            <Pencil1Icon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Hủy đơn'>
                        <IconButton
                            variant='soft'
                            color='red'
                            onClick={() => setOpenCancel(!openCancel)}
                            onMouseEnter={handleFetchOrderDetailWhenHovering(row.original.id)}
                            disabled={['CANCEL', 'SUCCESS'].includes(row.original.status)}
                        >
                            <Cross2Icon />
                        </IconButton>
                    </Tooltip>
                </Flex>
            )
        }
    ]

    const { refetch, data } = useQuery({
        queryKey: ['orders', JSON.stringify(query)],
        queryFn: ({ signal }) => OrderFetching.getAllOrder(query, signal),
        enabled: false,
        placeholderData: (oldData) => oldData
    })

    const { refetch: orderRefetch, data: orderDetailData } = useQuery({
        queryKey: ['orderDetail', orderId],
        queryFn: ({ signal }) => OrderFetching.getOrderDetail(orderId, signal),
        enabled: false,
        staleTime: 1000 * 60 * 5
    })

    const handleSelectChange = (value: string) => {
        if (value === 'ALL') {
            setQuery(omit(query, ['status']))
        } else {
            setQuery((pre) => {
                return {
                    ...pre,
                    status: value
                }
            })
        }
    }

    const handleResetFilter = () => {
        if (Object.keys(query).length > 2) {
            setQuery({ createdAt: 'desc' })
            setDate(undefined)
        }
    }

    const handlePreviousPage = () => {
        if (query.page && query.page > 1) {
            setQuery((pre) => {
                return {
                    ...pre,
                    page: (pre.page as number) - 1
                }
            })
        }
    }

    const handleNextPage = () => {
        if (query.page && query.page < (data?.data.result.query.page_size as number)) {
            setQuery((pre) => {
                return {
                    ...pre,
                    page: (pre.page as number) + 1
                }
            })
        }
    }

    const handleFetchOrderDetailWhenHovering = (orderId: string) => () => {
        setOrderId(orderId)
    }

    useEffect(() => {
        if (date) {
            setQuery((pre) => {
                return omitBy(
                    {
                        ...pre,
                        start_date: date.from ? startOfDay(add(date.from, { days: 0.5 })) : undefined,
                        end_date: date.to ? endOfDay(add(date.to, { days: 0.5 })) : undefined
                    },
                    isUndefined
                )
            })
        }
    }, [date])

    useEffect(() => {
        if (Object.keys(query).length > 1) {
            refetch()
        }
    }, [query])

    useEffect(() => {
        data &&
            setQuery((pre) => {
                return {
                    ...pre,
                    page: data.data.result.query.page
                }
            })
    }, [JSON.stringify(data)])

    useEffect(() => {
        orderId && orderRefetch()
    }, [orderId])

    return (
        <LayoutProfile title='Đơn hàng của bạn'>
            <Flex gapY={'5'} direction={'column'}>
                <Flex justify={'between'} align={'center'}>
                    <TextField.Root placeholder='Tìm kiếm sản phẩm...' size='3'>
                        <TextField.Slot>
                            <svg
                                width='17'
                                height='17'
                                viewBox='0 0 15 15'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z'
                                    fill='currentColor'
                                    fill-rule='evenodd'
                                    clip-rule='evenodd'
                                ></path>
                            </svg>
                        </TextField.Slot>
                    </TextField.Root>
                    <Flex gapX={'6'}>
                        <Flex gapX={'2'}>
                            <Flex maxWidth={'200px'} direction={'column'} flexShrink={'1'}>
                                <Select.Root
                                    size={'3'}
                                    defaultValue='ALL'
                                    value={query.status ?? 'ALL'}
                                    onValueChange={handleSelectChange}
                                >
                                    <Select.Trigger />
                                    <Select.Content className='!rounded-8' position='popper'>
                                        <Select.Group>
                                            <Select.Label>Trạng thái đơn hàng</Select.Label>
                                            <Select.Item value='ALL'>Tất cả</Select.Item>
                                            <Select.Item value='SUCCESS'>Thành công</Select.Item>
                                            <Select.Item value='CANCEL'>Đã hủy</Select.Item>
                                            <Select.Item value='WAITING_CONFIRM'>Chờ xác nhận</Select.Item>
                                            <Select.Item value='SHIPING'>Đang vận chuyển</Select.Item>
                                        </Select.Group>
                                    </Select.Content>
                                </Select.Root>
                            </Flex>
                            <DatePickerWithRange date={date} setDate={setDate} />
                            <Button size={'3'} color='red' onClick={handleResetFilter}>
                                Reset
                            </Button>
                        </Flex>
                        <Flex align={'baseline'} gapX={'3'}>
                            <Text size={'4'}>
                                {data?.data.result.query.page}/{data?.data.result.query.page_size}
                            </Text>
                            <Flex gapX={'1'}>
                                <IconButton size={'3'} variant='soft' color='gray' onClick={handlePreviousPage}>
                                    <ChevronLeftIcon />
                                </IconButton>
                                <IconButton size={'3'} variant='soft' color='gray' onClick={handleNextPage}>
                                    <ChevronRightIcon />
                                </IconButton>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
                <Table<OrderType>
                    columns={columns}
                    data={data?.data.result.data || []}
                    tableMaxHeight='520px'
                    className='w-[1200px] max-w-[1200px]'
                />
            </Flex>
            <AlertDialog.Root>
                <AlertDialog.Content maxWidth='700px'>
                    <AlertDialog.Title>Revoke access</AlertDialog.Title>
                    <AlertDialog.Description size='2'>
                        Are you sure? This application will no longer be accessible and any existing sessions will be
                        expired.
                    </AlertDialog.Description>

                    <Flex gap='3' mt='4' justify='end'>
                        <AlertDialog.Cancel>
                            <Button variant='soft' color='gray'>
                                Cancel
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button variant='solid' color='red'>
                                Revoke access
                            </Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
            <OrderDetail
                isOpen={openDetail}
                setIsOpen={setOpenDetail}
                data={orderDetailData?.data.result.ProductOrder || []}
                orderData={orderDetailData?.data.result}
            />
            <OrderEdit
                isOpen={openEdit}
                setIsOpen={setOpenEdit}
                data={orderDetailData?.data.result.ProductOrder || []}
                orderData={orderDetailData?.data.result}
            />
            <OrderCancel isOpen={openCancel} setIsOpen={setOpenCancel} orderId={orderId} refetch={refetch} />
        </LayoutProfile>
    )
}

export default Order
