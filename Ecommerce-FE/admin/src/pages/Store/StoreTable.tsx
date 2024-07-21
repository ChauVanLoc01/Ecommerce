import { InfoCircledIcon, LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons'
import { Avatar, Badge, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { UseMutateFunction } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { AxiosResponse } from 'axios'
import { format, formatDistanceToNow } from 'date-fns'
import { useMemo } from 'react'
import { BiSolidSortAlt } from 'react-icons/bi'
import Image from 'src/components/Image/Image'
import Table from 'src/components/Table'
import { formatDefault } from 'src/constants/date.constants'
import { Status } from 'src/constants/product.status'
import { OrderColor, OrderLabel, OrderStatus } from 'src/constants/store.constants'
import { Store } from 'src/types/auth.type'
import { StoreQuery } from 'src/types/store.type'

type Props = {
    stores: Store[]
    query: StoreQuery
    setStatusUpdateOpen: React.Dispatch<React.SetStateAction<boolean>>
    setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedStore: React.Dispatch<React.SetStateAction<Store | undefined>>
}

const StoreTable = ({ stores, setStatusUpdateOpen, setDetailOpen, setSelectedStore, query }: Props) => {
    const hanldeOpenUpdateStatus = (store: Store) => () => {
        setStatusUpdateOpen((pre) => !pre)
        setSelectedStore(store)
    }
    const handleOpenDetail = (store: Store) => () => {
        setDetailOpen((pre) => !pre)
        setSelectedStore(store)
    }

    const columns: ColumnDef<Store>[] = useMemo(() => {
        return [
            {
                accessorKey: 'name',
                header: () => {
                    return (
                        <Flex justify='center' align='center' className='gap-x-3'>
                            <Text>Hình ảnh</Text>
                            <BiSolidSortAlt />
                        </Flex>
                    )
                },
                cell: ({
                    row: {
                        original: { image, name }
                    }
                }) => (
                    <Flex justify='center' align='center'>
                        <Image src={image} fallback={name} />
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
                    <Flex direction={'column'} justify='center' align='center'>
                        <Text size={'2'} className='text-gray-400'>
                            {formatDistanceToNow(createdAt)}
                        </Text>
                        <Text>{format(createdAt, formatDefault)}</Text>
                    </Flex>
                )
            },
            {
                accessorKey: 'action',
                header: '',
                cell: ({ row: { original } }) => {
                    let isActive = original.status === Status.active
                    return (
                        <Flex gapX={'2'} align='center'>
                            <Tooltip content='Chi tiết'>
                                <IconButton variant='soft' onClick={handleOpenDetail(original)}>
                                    <InfoCircledIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content={isActive ? 'Khóa cửa hàng' : 'Mở khóa cửa hàng'}>
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
    }, [query])

    return <Table<Store> id='store-table' columns={columns} data={stores} tableMaxHeight='500px' />
}

export default StoreTable
