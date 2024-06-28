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
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Nội dung
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Text className='flex justify-center'>{row.original.detail}</Text>
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
                <Badge color={RatingStatus[Number(row.original.isReply)].color as any} className='flex justify-center'>
                    {RatingStatus[Number(row.original.isReply)].lable}
                </Badge>
            )
        },
        {
            accessorKey: 'status',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Phản hồi bởi
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Badge color={RatingStatus[Number(row.original.isReply)].color as any} className='flex justify-center'>
                    {RatingStatus[Number(row.original.isReply)].lable}
                </Badge>
            )
        },
        {
            accessorKey: 'status',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Mã đơn hàng
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Badge color={RatingStatus[Number(row.original.isReply)].color as any} className='flex justify-center'>
                    {RatingStatus[Number(row.original.isReply)].lable}
                </Badge>
            )
        },
        {
            accessorKey: 'status',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Mã sản phẩm
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Badge color={RatingStatus[Number(row.original.isReply)].color as any} className='flex justify-center'>
                    {RatingStatus[Number(row.original.isReply)].lable}
                </Badge>
            )
        },
        {
            accessorKey: 'createdAt',
            header: () => (
                <div className='flex items-center justify-evenly gap-x-2'>
                    Thời gian tạo
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
            accessorKey: 'createdAt',
            header: () => (
                <div className='flex items-center justify-evenly gap-x-2'>
                    Cập nhật lúc
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
