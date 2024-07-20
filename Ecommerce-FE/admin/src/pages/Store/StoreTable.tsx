import { InfoCircledIcon } from '@radix-ui/react-icons'
import { Badge, Checkbox, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { Flex } from 'antd'
import { format } from 'date-fns'
import { BiSolidSortAlt } from 'react-icons/bi'
import { HiOutlineSwitchHorizontal } from 'react-icons/hi'
import Table from 'src/components/Table'
import { formatDefault } from 'src/constants/date.constants'
import { OrderColor, OrderLabel, OrderStatus } from 'src/constants/store.constants'
import { Store } from 'src/types/auth.type'

type Props = {
    stores: Store[]
    setStatusUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedStore: React.Dispatch<React.SetStateAction<Store | undefined>>
}

const StoreTable = ({ stores, setStatusUpdateOpen, setDetailOpen, setSelectedStore }: Props) => {
    const hanldeOpenUpdateStatus = (store: Store) => () => {
        setStatusUpdateOpen((pre) => !pre)
        setSelectedStore(store)
    }
    const handleOpenDetail = (store: Store) => () => {
        setDetailOpen((pre) => !pre)
        setSelectedStore(store)
    }

    const columns: ColumnDef<Store>[] = [
        {
            accessorKey: 'checkbox',
            header: () => {
                return (
                    <Flex justify='center' align='center'>
                        <Checkbox />
                    </Flex>
                )
            },
            cell: () => (
                <Flex justify='center' align='center'>
                    <Checkbox />
                </Flex>
            )
        },
        {
            accessorKey: 'name',
            header: () => {
                return (
                    <Flex justify='center' align='center' className='gap-x-3'>
                        <Text>Tên cửa hàng</Text>
                        <BiSolidSortAlt />
                    </Flex>
                )
            },
            cell: ({
                row: {
                    original: { name }
                }
            }) => (
                <Flex justify='center' align='center'>
                    <Text>{name}</Text>
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
                    <Badge color={OrderColor[status as OrderStatus]}>{OrderLabel[status as OrderStatus]}</Badge>
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
                    <Text>{format(createdAt, formatDefault)}</Text>
                </Flex>
            )
        },
        {
            accessorKey: 'action',
            header: '',
            cell: ({ row: { original } }) => (
                <Flex gap={2} align='center' className='space-x-2'>
                    <Tooltip content='Chi tiết'>
                        <IconButton onClick={handleOpenDetail(original)}>
                            <InfoCircledIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Trạng thái'>
                        <IconButton onClick={hanldeOpenUpdateStatus(original)}>
                            <HiOutlineSwitchHorizontal />
                        </IconButton>
                    </Tooltip>
                </Flex>
            )
        }
    ]

    return <Table<Store> columns={columns} data={stores} />
}

export default StoreTable
