import { InfoCircledIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BiSolidSortAlt } from 'react-icons/bi'
import Table from 'src/components/Table'
import { UserStatus } from 'src/constants/order.status'
import { Voucher } from 'src/types/voucher.type'
import { checkExpired, convertCurrentcy } from 'src/utils/utils'
import VoucherUpdateStatus from './VoucherUpdateStatus'

type VoucherTableProps = {
    data: Voucher[]
    refetchDataAll: () => Promise<void>
}

const VoucherTable = ({ data, refetchDataAll }: VoucherTableProps) => {
    const columns: ColumnDef<Voucher>[] = [
        {
            accessorKey: 'code',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Mã code
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Text className='flex justify-center'>{row.original.code}</Text>
        },
        {
            accessorKey: 'title',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Tiêu đề
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Text className='flex justify-center'>{row.original.title}</Text>
        },
        {
            accessorKey: 'status',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Trạng thái
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='flex justify-center'>
                    <Badge size={'3'} color={UserStatus[row.original.status].color as any}>
                        {UserStatus[row.original.status].lable}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'expired',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Tình trạng
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='flex justify-center'>
                    <Badge size={'3'} color={checkExpired(row) ? 'green' : 'red'}>
                        {checkExpired(row) ? 'Có thể sử dụng' : 'Hết hạn'}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'type',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Loại
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Text className='flex justify-center'>{row.original.type}</Text>
        },
        {
            accessorKey: 'percent',
            header: () => (
                <div className='flex items-center gap-x-2'>
                    % giảm
                    <BiSolidSortAlt />
                </div>
            ),
            cell: ({ row }) => (
                <Text color='blue' className='flex justify-center'>
                    {row.original.percent}
                </Text>
            )
        },
        {
            accessorKey: 'maximum',
            header: () => (
                <div className='flex items-center justify-evenly gap-x-2'>
                    Giảm tối đa
                    <BiSolidSortAlt />
                </div>
            ),
            cell: ({ row }) => <Text className='flex justify-center'>{convertCurrentcy(row.original.maximum)}</Text>
        },
        {
            accessorKey: 'currentQuantity',
            header: () => (
                <div className='flex items-center justify-evenly gap-x-2'>
                    Số lượng còn lại
                    <BiSolidSortAlt />
                </div>
            ),
            cell: ({ row }) => (
                <Text className='flex justify-center'>{convertCurrentcy(row.original.currentQuantity, false)}</Text>
            )
        },
        {
            accessorKey: 'startDate',
            header: () => (
                <div className='flex items-center justify-evenly gap-x-2'>
                    Bắt đầu
                    <BiSolidSortAlt />
                </div>
            ),
            cell: ({ row }) => (
                <div className='lowercase flex flex-col items-center'>
                    <span className='italic text-gray-400 text-[14px]'>
                        {formatDistance(row.original.startDate, new Date().toISOString(), {
                            addSuffix: true,
                            locale: vi
                        })}
                    </span>
                    <span>{format(row.original.startDate, 'hh:mm dd-MM-yyyy')}</span>
                </div>
            )
        },
        {
            accessorKey: 'endDate',
            header: () => (
                <div className='flex items-center justify-evenly gap-x-2'>
                    Kết thúc
                    <BiSolidSortAlt />
                </div>
            ),
            cell: ({ row }) => (
                <div className='lowercase flex flex-col items-center'>
                    <span className='italic text-gray-400 text-[14px]'>
                        {formatDistance(row.original.endDate, new Date().toISOString(), {
                            addSuffix: true,
                            locale: vi
                        })}
                    </span>
                    <span>{format(row.original.endDate, 'hh:mm dd-MM-yyyy')}</span>
                </div>
            )
        },
        {
            accessorKey: 'createdAt',
            header: () => (
                <div className='flex items-center justify-evenly gap-x-2'>
                    Tạo lúc
                    <BiSolidSortAlt />
                </div>
            ),
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
                    <VoucherUpdateStatus row={row} refetchAll={refetchDataAll} />
                </Flex>
            )
        }
    ]
    return <Table<Voucher> columns={columns} data={data} tableMaxHeight='500px' className='w-[2200px]' />
}

export default VoucherTable
