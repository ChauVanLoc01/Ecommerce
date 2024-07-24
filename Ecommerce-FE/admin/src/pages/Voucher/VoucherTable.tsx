import { Badge, Flex, Text } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistance, isPast } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BiSolidSortAlt } from 'react-icons/bi'
import Table from 'src/components/Table'
import { UserStatus } from 'src/constants/order.status'
import { order_status } from 'src/constants/product.status'
import { Voucher } from 'src/types/voucher.type'
import { checkExpired, convertCurrentcy } from 'src/utils/utils'
import VoucherDetail from './VoucherDetail'
import VoucherUpdate from './VoucherUpdate'
import VoucherUpdateStatus from './VoucherUpdateStatus'

type VoucherTableProps = {
    data: Voucher[]
    refetchDataAll: () => Promise<void>
}

const VoucherTable = ({ data, refetchDataAll }: VoucherTableProps) => {
    const columns: ColumnDef<Voucher>[] = [
        {
            accessorKey: 'code',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Mã code
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Text className='flex justify-center'>{row.original.code}</Text>
                </Flex>
            )
        },
        {
            accessorKey: 'title',
            header: () => {
                return (
                    <Flex justify={'center'} align={'center'}>
                        <div className='flex items-center justify-evenly gap-x-2'>
                            Tiêu đề
                            <BiSolidSortAlt />
                        </div>
                    </Flex>
                )
            },
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Text className='flex justify-center'>{row.original.title}</Text>
                </Flex>
            )
        },
        {
            accessorKey: 'status',
            header: () => {
                return (
                    <Flex justify={'center'} align={'center'}>
                        <div className='flex items-center justify-evenly gap-x-2'>
                            Trạng thái
                            <BiSolidSortAlt />
                        </div>
                    </Flex>
                )
            },
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Badge size={'3'} color={UserStatus[row.original.status].color as any}>
                        {UserStatus[row.original.status].lable}
                    </Badge>
                </Flex>
            )
        },
        {
            accessorKey: 'expired',
            header: () => {
                return (
                    <Flex justify={'center'} align={'center'}>
                        <div className='flex items-center justify-evenly gap-x-2'>
                            Tình trạng
                            <BiSolidSortAlt />
                        </div>
                    </Flex>
                )
            },
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Badge size={'3'} color={order_status[checkExpired(row)] as any}>
                        {checkExpired(row)}
                    </Badge>
                </Flex>
            )
        },
        {
            accessorKey: 'percent',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center gap-x-2'>
                        % giảm
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Text color='blue' className='flex justify-center'>
                        {row.original.percent}
                    </Text>
                </Flex>
            )
        },
        {
            accessorKey: 'maximum',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Giảm tối đa
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => <Text className='flex justify-center'>{convertCurrentcy(row.original.maximum)}</Text>
        },
        {
            accessorKey: 'currentQuantity',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Số lượng còn lại
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Text className='flex justify-center'>{convertCurrentcy(row.original.currentQuantity, false)}</Text>
                </Flex>
            )
        },
        {
            accessorKey: 'startDate',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Bắt đầu
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <div className='lowercase flex flex-col items-center'>
                        <span className='italic text-gray-400 text-[14px]'>
                            {formatDistance(row.original.startDate, new Date().toISOString(), {
                                addSuffix: true,
                                locale: vi
                            })}
                        </span>
                        <span>{format(row.original.startDate, 'hh:mm dd-MM-yyyy')}</span>
                    </div>
                </Flex>
            )
        },
        {
            accessorKey: 'endDate',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Kết thúc
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <div className='lowercase flex flex-col items-center'>
                        <span className='italic text-gray-400 text-[14px]'>
                            {formatDistance(row.original.endDate, new Date().toISOString(), {
                                addSuffix: true,
                                locale: vi
                            })}
                        </span>
                        <span>{format(row.original.endDate, 'hh:mm dd-MM-yyyy')}</span>
                    </div>
                </Flex>
            )
        },
        {
            accessorKey: 'createdAt',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Tạo lúc
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <div className='lowercase flex flex-col items-center'>
                        <span className='italic text-gray-400 text-[14px]'>
                            {formatDistance(row.original.createdAt, new Date().toISOString(), {
                                addSuffix: true,
                                locale: vi
                            })}
                        </span>
                        <span>{format(row.original.createdAt, 'hh:mm dd-MM-yyyy')}</span>
                    </div>
                </Flex>
            )
        },
        {
            accessorKey: ' ',
            cell: ({ row }) => (
                <Flex gapX={'2'} align={'center'}>
                    <VoucherDetail voucher={row.original} />
                    <VoucherUpdate refetchDataAll={refetchDataAll} voucher={row.original} />
                    <VoucherUpdateStatus
                        row={row}
                        refetchAll={refetchDataAll}
                        isDisable={isPast(row.original.endDate)}
                    />
                </Flex>
            )
        }
    ]
    return <Table<Voucher> columns={columns} data={data} tableMaxHeight='500px' className='w-[2200px]' />
}

export default VoucherTable
