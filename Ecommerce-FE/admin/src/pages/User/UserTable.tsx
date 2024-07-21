import { InfoCircledIcon, LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistanceToNow } from 'date-fns'
import { BiSolidSortAlt } from 'react-icons/bi'
import Table from 'src/components/Table'
import { formatDefault } from 'src/constants/date.constants'
import { Status } from 'src/constants/product.status'
import { OrderColor, OrderLabel, OrderStatus } from 'src/constants/store.constants'
import { User } from 'src/types/auth.type'

type Props = {
    users: User[]
    setStatusUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

const UserTable = ({ users, setStatusUpdateOpen, setDetailOpen, setSelectedUser }: Props) => {
    const hanldeOpenUpdateStatus = (user: User) => () => {
        setStatusUpdateOpen((pre) => !pre)
        setSelectedUser(user)
    }
    const handleOpenDetail = (user: User) => () => {
        setDetailOpen((pre) => !pre)
        setSelectedUser(user)
    }

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'name',
            header: () => {
                return (
                    <Flex justify='center' align='center' className='gap-x-3'>
                        <Text>Họ tên</Text>
                        <BiSolidSortAlt />
                    </Flex>
                )
            },
            cell: ({
                row: {
                    original: { full_name }
                }
            }) => (
                <Flex justify='center' align='center'>
                    <Text>{full_name}</Text>
                </Flex>
            )
        },
        {
            accessorKey: 'status',
            header: () => {
                return (
                    <Flex justify='center' align='center' className='gap-x-3'>
                        <Text>Trạng thái</Text>
                        <BiSolidSortAlt />
                    </Flex>
                )
            },
            cell: ({
                row: {
                    original: { status }
                }
            }) => (
                <Flex justify='center' align='center'>
                    <Badge size={'3'} color={OrderColor[status as OrderStatus]}>
                        {OrderLabel[status as OrderStatus]}
                    </Badge>
                </Flex>
            )
        },
        {
            accessorKey: 'createdAt',
            header: () => {
                return (
                    <Flex justify='center' align='center' className='gap-x-3'>
                        <Text>Thời gian tạo</Text>
                        <BiSolidSortAlt />
                    </Flex>
                )
            },
            cell: ({
                row: {
                    original: { createdAt }
                }
            }) => (
                <Flex justify='center' align='center'>
                    <Flex direction={'column'} justify={'center'} align={'center'}>
                        <Text size={'2'} className='text-gray-400'>
                            {formatDistanceToNow(createdAt)}
                        </Text>
                        <Text>{format(createdAt, formatDefault)}</Text>
                    </Flex>
                </Flex>
            )
        },
        {
            accessorKey: 'action',
            header: '',
            cell: ({ row: { original } }) => {
                let isActive = original.status === Status.active
                return (
                    <Flex align='center' className='space-x-2'>
                        <Tooltip content='Chi tiết'>
                            <IconButton size={'2'} variant='soft' color='blue' onClick={handleOpenDetail(original)}>
                                <InfoCircledIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content={isActive ? 'Khóa người dùng' : 'Mở khóa người dùng'}>
                            <IconButton
                                size={'2'}
                                variant='soft'
                                color='orange'
                                onClick={hanldeOpenUpdateStatus(original)}
                            >
                                {[<LockClosedIcon />, <LockOpen1Icon />][+isActive]}
                            </IconButton>
                        </Tooltip>
                    </Flex>
                )
            }
        }
    ]

    return <Table<User> columns={columns} data={users} tableMaxHeight='500px' />
}

export default UserTable
