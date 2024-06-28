import { InfoCircledIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useState } from 'react'
import { BiSolidSortAlt } from 'react-icons/bi'
import Table from 'src/components/Table'
import { RatingStatus } from 'src/constants/rating.constants'
import { RatingTableType, RatingFromUser } from 'src/types/rating.type'
import ReplyRatingCreate from './RatingForm'

type RatingTableProps = {
    data: RatingTableType[]
    refetchDataAll: () => Promise<any>
}

const RatingTable = ({ data }: RatingTableProps) => {
    const [openReplyRating, setOpenReplyRating] = useState<boolean>(false)

    const ratingFromUser: RatingFromUser | undefined = {
        ratingId: '123123',
        userId: '123123',
        username: 'Test',
        email: 'abc@example.com',
        comment: 'Amazing Good job em',
        replyCreatedTime: new Date('1/1/2024'),
        stars: 4
    }

    const handleOpenReplyForm = () => {
        setOpenReplyRating(!openReplyRating)
    }

    const columns: ColumnDef<RatingTableType>[] = [
        {
            accessorKey: 'title',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Tên khách hàng
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Text className='flex justify-center'>{row.original.userName}</Text>
        },
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
                            <Pencil1Icon onClick={handleOpenReplyForm} />
                        </IconButton>
                    </Tooltip>
                </Flex>
            )
        }
    ]

    return (
        <div>
            <Table<RatingTableType> columns={columns} data={data} tableMaxHeight='500px' className='w-[2200px]' />
            <ReplyRatingCreate
                ratingFromUser={ratingFromUser}
                openReplyRating={openReplyRating}
                setOpenReplyRating={setOpenReplyRating}
            ></ReplyRatingCreate>
        </div>
    )
}

export default RatingTable
