import { AlertDialog, Avatar, Button, Flex, Text } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { BiSolidSortAlt } from 'react-icons/bi'
import Table from 'src/components/Table'
import { ProductOrderWithProduct } from 'src/types/order.type'
import { convertCurrentcy, convertDigitalNumber } from 'src/utils/utils.ts'

type OrderDetailProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: ProductOrderWithProduct[]
}

const OrderDetail = ({ isOpen, setIsOpen, data }: OrderDetailProps) => {
    const columns: ColumnDef<ProductOrderWithProduct>[] = [
        {
            accessorKey: 'Hình ảnh',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2 line-clamp-2 w-36'>
                        Hình ảnh
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Avatar src={row.original.image} fallback='A' />
        },
        {
            accessorKey: 'Tên sản phẩm',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2 line-clamp-2 w-36'>
                        Tên sản phẩm
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <div className='line-clamp-2 w-36'>{row.original.name}</div>
        },
        {
            accessorKey: 'Số lượng mua',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2 line-clamp-2 w-36'>
                        Số lượng mua
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Text>{convertDigitalNumber(row.original.quantity)}</Text>
        },
        {
            accessorKey: 'Giá chưa giảm',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Giá chưa giảm
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Text>{row.original.priceBefore ? convertCurrentcy(row.original.priceBefore) : '-'}</Text>
            )
        },
        {
            accessorKey: 'Giá đã giảm',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Giá đã giảm
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Text>{convertCurrentcy(row.original.priceAfter)}đ</Text>
        },
        {
            accessorKey: 'Giá sản phẩm hiện tại',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2'>
                        Giá sản phẩm hiện tại
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({ row }) => <Text>{convertCurrentcy(row.original.currentPriceAfter)}</Text>
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
            cell: ({ row }) => <Text>{convertCurrentcy(row.original.priceAfter * row.original.quantity)}đ</Text>
        }
    ]

    return (
        <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialog.Content maxWidth='600px' className='!rounded-8'>
                <AlertDialog.Title>Thông tin chi tiết đơn hàng</AlertDialog.Title>
                <Table<ProductOrderWithProduct> columns={columns} data={data}></Table>
                <Flex gap='3' mt='4' justify='end'>
                    <AlertDialog.Cancel>
                        <Button>Trở về</Button>
                    </AlertDialog.Cancel>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default OrderDetail
