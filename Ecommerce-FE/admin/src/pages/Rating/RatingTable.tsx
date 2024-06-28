import { InfoCircledIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BiSolidSortAlt } from 'react-icons/bi'
import Table from 'src/components/Table'
import { RatingStatus } from 'src/constants/rating.constants'
import { Rating } from 'src/types/rating.type'

type RatingTableProps = {
    data: Rating[]
    refetchDataAll: () => Promise<any>
}

const RatingTable = ({ data }: RatingTableProps) => {
    const columns: ColumnDef<Rating>[] = [
        {
            accessorKey: 'detail',
            header: () => {
                return (
                    <Flex align={'center'} justify={'center'} className='space-x-2'>
                        <Text>Nội dung</Text>
                        <BiSolidSortAlt />
                    </Flex>
                )
            },
            cell: ({ row }) => <Text className='flex justify-center'>{row.original.comment}</Text>
        },
        {
            accessorKey: 'status',
            header: () => {
                return (
                    <Flex align={'center'} justify={'center'} className='space-x-2'>
                        <Text>Trạng thái</Text>
                        <BiSolidSortAlt />
                    </Flex>
                )
            },
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Badge color={RatingStatus[Number(row.original.isReply)].color as any} className='mx-auto'>
                        {RatingStatus[Number(row.original.isReply)].lable}
                    </Badge>
                </Flex>
            )
        },
        {
            accessorKey: 'status',
            header: () => {
                return (
                    <Flex align={'center'} justify={'center'} className='space-x-2 max-w-32 mx-auto'>
                        <Text>Mã đơn hàng</Text>
                        <BiSolidSortAlt />
                    </Flex>
                )
            },
            cell: ({ row }) => <Text className='line-clamp-1 w-full max-w-32 mx-auto'>{row.original.orderId}</Text>
        },
        {
            accessorKey: 'createdAt',
            header: () => (
                <Flex align={'center'} justify={'center'} className='space-x-2'>
                    <Text>Thời gian tạo</Text>
                    <BiSolidSortAlt />
                </Flex>
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
            accessorKey: 'createdAt',
            header: () => (
                <Flex align={'center'} justify={'center'} className='space-x-2'>
                    <Text>Cập nhật lúc</Text>
                    <BiSolidSortAlt />
                </Flex>
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
            cell: () => (
                <Flex gapX={'2'} align={'center'}>
                    <Tooltip content='Xem chi tiết'>
                        <IconButton variant='soft'>
                            <InfoCircledIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Chỉnh sửa'>
                        <IconButton variant='soft' color='orange'>
                            <Pencil1Icon />
                        </IconButton>
                    </Tooltip>
                </Flex>
            )
        }
    ]
    return <Table<Rating> columns={columns} data={data} tableMaxHeight='500px' className='w-[1500px]' />
}

export default RatingTable
