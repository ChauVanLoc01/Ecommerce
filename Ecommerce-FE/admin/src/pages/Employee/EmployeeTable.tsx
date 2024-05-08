import { Cross2Icon, InfoCircledIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BiSolidSortAlt } from 'react-icons/bi'
import { EmployeeApi } from 'src/apis/employee.api'
import Table from 'src/components/Table'
import { UserStatus } from 'src/constants/order.status'
import { EmployeeList } from 'src/types/employee.type'

const EmployeeTable = () => {
    const { data } = useQuery({
        queryKey: ['employeeList', JSON.stringify({ limit: import.meta.env.VITE_LIMIT })],
        queryFn: () => EmployeeApi.getAllEmployee({ limit: import.meta.env.VITE_LIMIT }),
        staleTime: 1000 * 60 * 1,
        enabled: false,
        select: (data) => data.data.result
    })

    const columns: ColumnDef<EmployeeList>[] = [
        {
            accessorKey: 'Mã nhân viên',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly max-w-36'>
                        Mã nhân viên
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Text className='!max-w-36 line-clamp-1'>{row.original.userId}</Text>
        },
        {
            accessorKey: 'Họ tên',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Họ tên
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='text-center'>
                    <Text>{row.original.User_Account_userIdToUser.full_name}</Text>
                </div>
            )
        },
        {
            accessorKey: 'Tài khoản',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Tài khoản
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='text-center'>
                    <Text>{row.original.username}</Text>
                </div>
            )
        },
        {
            accessorKey: 'Email',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Email
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='text-center'>
                    <Text>{row.original.User_Account_userIdToUser.email}</Text>
                </div>
            )
        },
        {
            accessorKey: 'Địa chỉ',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Địa chỉ
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='text-center'>
                    <Text>{row.original.User_Account_userIdToUser.address}</Text>
                </div>
            )
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
                    <Badge size={'3'} color={UserStatus[row.original.User_Account_userIdToUser.status].color as any}>
                        {UserStatus[row.original.User_Account_userIdToUser.status].lable}
                    </Badge>
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
            accessorKey: 'Cập nhật',
            header: () => {
                return (
                    <div className='flex items-center justify-evenly gap-x-2'>
                        Cập nhật
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
                            disabled={['CANCEL', 'SUCCESS'].includes(row.original.User_Account_userIdToUser.status)}
                        >
                            <Pencil1Icon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Hủy đơn'>
                        <IconButton
                            variant='soft'
                            color='red'
                            disabled={['CANCEL', 'SUCCESS'].includes(row.original.User_Account_userIdToUser.status)}
                        >
                            <Cross2Icon />
                        </IconButton>
                    </Tooltip>
                </Flex>
            )
        }
    ]

    return <Table<EmployeeList> columns={columns} data={data?.data ?? []} className='min-w-full w-[1700px]' />
}

export default EmployeeTable
