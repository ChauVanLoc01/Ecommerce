import { PaperPlaneIcon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, Spinner, Text, Tooltip } from '@radix-ui/themes'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useRef, useState } from 'react'
import { BiSolidSortAlt } from 'react-icons/bi'
import { toast } from 'sonner'
import { RatingAPI } from 'src/apis/rating.api'
import { UploadApi } from 'src/apis/upload_file.api'
import Table from 'src/components/Table'
import { RatingStatus } from 'src/constants/rating.constants'
import { RatingReplyBody, RatingTableType } from 'src/types/rating.type'
import ReplyRatingCreate from './RatingForm'

type RatingTableProps = {
    data: RatingTableType[]
    refetchDataAll: () => Promise<any>
}

const RatingTable = ({ data }: RatingTableProps) => {
    const [isReplyRating, setIsReplyRating] = useState<boolean>(false)
    const [userId, setUserId] = useState<string>('')
    const commentRef = useRef<() => void>()
    const [files, setFiles] = useState<{ files: Map<number, File>; primary?: number }>({ files: new Map() })
    const [openReplyRating, setOpenReplyRating] = useState<boolean>(false)
    const [isCreating, setIsCreating] = useState<boolean>(false)
    const [selectedRating, setSelectedRating] = useState<RatingTableType | undefined>(undefined)
    const [replyData, setReplyData] = useState<RatingReplyBody>({
        parentRatingId: '',
        comment: ''
    })

    const { data: userProfileDetail, isFetching } = useQuery({
        queryKey: ['user-profile-in-rating', userId],
        queryFn: RatingAPI.getProfileUserInRating(userId),
        enabled: !!userId,
        staleTime: 1000 * 60 * 3,
        select: (data) => data.data.result
    })

    const { mutate: createReplyRating } = useMutation({
        mutationFn: RatingAPI.replyRating,
        onSuccess: () => {
            toast.success('Đánh giá thành công')
            setIsReplyRating(false)
            setTimeout(() => setOpenReplyRating(false), 500)
        }
    })

    const { mutate: uploadMultipleFile } = useMutation({
        mutationFn: UploadApi.updateMultipleFile,
        onSuccess: (urls) => {
            toast.success('Upload hình ảnh thành công')
            createReplyRating({ ...replyData, urls: urls.data.result.map((url) => ({ url })) })
        }
    })

    const handleOpenReplyForm = (parentRatingId: string, row: RatingTableType) => () => {
        setOpenReplyRating(true)
        setReplyData((pre) => ({
            ...pre,
            parentRatingId
        }))
        setSelectedRating(row)
    }

    const handleChangeComment = (comment: string) => () => setReplyData((pre) => ({ ...pre, comment }))

    const handleComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value
        if (commentRef.current) {
            document.removeEventListener('focusout', commentRef.current)
        }
        commentRef.current = handleChangeComment(value)
        document.addEventListener('focusout', commentRef.current)
    }

    const onMouseEnter = (id: string) => () => setUserId(id)

    const onCreateReplyRating = () => {
        if (!replyData.comment) {
            toast.warning('Nhận xét là bắt buộc')
            return
        }
        setIsCreating(true)
        if (!files.files.size) {
            createReplyRating(replyData)
            return
        }
        const formData = new FormData()
        files.files.forEach((file, _) => {
            formData.append('files', file)
        })
        uploadMultipleFile(formData)
    }

    const columns: ColumnDef<RatingTableType>[] = [
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
            cell: ({ row }) => (
                <Flex gapX={'2'} align={'center'}>
                    <Tooltip content='Phản hồi'>
                        <IconButton variant='soft' color='orange' onMouseEnter={onMouseEnter(row.original.createdBy)}>
                            {isFetching && row.original.id === replyData.parentRatingId ? (
                                <Spinner />
                            ) : (
                                <PaperPlaneIcon onClick={handleOpenReplyForm(row.original.id, row.original)} />
                            )}
                        </IconButton>
                    </Tooltip>
                </Flex>
            )
        }
    ]

    return (
        <div>
            <Table<RatingTableType> columns={columns} data={data} tableMaxHeight='500px' className='w-[1500px]' />
            {selectedRating && userProfileDetail && (
                <ReplyRatingCreate
                    rating={selectedRating}
                    user={userProfileDetail}
                    openReplyRating={openReplyRating}
                    setOpenReplyRating={setOpenReplyRating}
                    handleComment={handleComment}
                    files={files}
                    setFiles={setFiles}
                    isCreating={isCreating}
                    setUserId={setUserId}
                    onCreateReplyRating={onCreateReplyRating}
                />
            )}
        </div>
    )
}

export default RatingTable
