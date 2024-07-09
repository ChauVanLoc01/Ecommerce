import { AlertDialog, Badge, Button, Flex, Text } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { BiSolidSortAlt } from 'react-icons/bi'
import Table from 'src/components/Table'
import { OrderStatus } from 'src/constants/order-status'
import { Order } from 'src/types/order.type'
import { convertCurrentcy } from 'src/utils/utils.ts'

type CreateOrderProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: Order[]
    setStep: React.Dispatch<React.SetStateAction<number>>
}

const CreateOrder = ({ open, setOpen, data, setStep }: CreateOrderProps) => {
    const columns: ColumnDef<Order>[] = [
        {
            accessorKey: 'Mã đơn hàng',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2 max-w-32'>
                        Mã đơn hàng
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <div className='line-clamp-1 max-w-32'>{row.original.id}</div>
        },
        {
            accessorKey: 'Trạng thái',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Trạng thái
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <div className='text-center'>
                    <Badge color={(OrderStatus?.[row.original.status]?.color as any) || 'red'} size={'3'}>
                        {OrderStatus?.[row.original.status]?.label}
                    </Badge>
                </div>
            )
        },
        {
            accessorKey: 'Tổng tiền',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Tổng tiền
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <div className='capitalize'>{convertCurrentcy(row.original.total)}</div>
        },
        {
            accessorKey: 'Giảm giá',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Giảm giá
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <div className='capitalize'>{convertCurrentcy(row.original.discount)}</div>
        },
        {
            accessorKey: 'Số tiền cần trả',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Số tiền cần trả
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <div className='capitalize'>{convertCurrentcy(row.original.pay)}</div>
        },
        {
            accessorKey: 'Thời gian tạo',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Thời gian tạo
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Flex align={'center'} justify={'center'} direction={'column'}>
                    <Text>{format(row.original.createdAt, 'HH:mm')}</Text>
                    <Text>{format(row.original.createdAt, 'dd/LL/y')}</Text>
                </Flex>
            )
        }
    ]

    useEffect(() => {
        return () => setStep(1)
    }, [])

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Content maxWidth={'900px'} className='!rounded-8'>
                <AlertDialog.Title>Đặt hàng thành công</AlertDialog.Title>
                <AlertDialog.Description size='2'>
                    <Table<Order> columns={columns} data={data} className='w-[1400px]' />
                </AlertDialog.Description>
                <Flex gap='3' mt='4' justify='end'>
                    <AlertDialog.Cancel>
                        <Button color='red' variant='outline'>
                            Đóng
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button color='blue'>Xem chi tiết</Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default CreateOrder
