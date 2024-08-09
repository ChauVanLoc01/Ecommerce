import { Button, Checkbox, Flex, Spinner, TextArea, TextField } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { BiSolidSortAlt } from 'react-icons/bi'
import Avatar from 'src/components/Avatar/Avatar'
import MultiUploadFile from 'src/components/MultiUploadFile/MultiUploadFile'
import Table from 'src/components/Table'
import { OrderFlowEnum, OrderNextFlowLabel } from 'src/constants/order-status'
import { CreateOrderRefund, OrderDetailResponse, OrderRefund, ProductOrder } from 'src/types/order.type'
import { Product } from 'src/types/product.type'

type Props = {
    id: number
    new_flow: OrderFlowEnum
    isRefund: boolean
    isRequestRefund: boolean
    orderRefund: Omit<CreateOrderRefund, 'productOrders'> & {
        productOrders: Map<
            string,
            Pick<ProductOrder, 'id' | 'quantity'> & {
                original_quantity: number
            }
        >
    }
    checked: Set<string>
    handleSelectAll: (checked: boolean) => void
    handleSelectProductRefund: (productOrderId: string) => (isChecked: boolean) => void
    handleChangeQuantity: (productId: string) => (e: React.ChangeEvent<HTMLInputElement>) => void
    filesRefun: {
        files: Map<number, File>
        primary?: number
    }
    setFilesRefun: React.Dispatch<
        React.SetStateAction<{
            files: Map<number, File>
            primary?: number
        }>
    >
    ProductOrder: (ProductOrder &
        Pick<Product, 'name' | 'image' | 'category'> & {
            current_price_after: number
        })[]
    handleRequestRefund: (idx: number, note: string) => () => void
    updating: {
        id?: number
        isUpdating: boolean
    }
    handleUpdateStatusOfOrder: (idx: number, status: OrderFlowEnum, note: string, orderRefundId?: string) => () => void
    orderRefundSorted: OrderRefund[]
    isComplain: boolean
}

const OrderFlowForm = ({
    id,
    new_flow,
    isRefund,
    isRequestRefund,
    orderRefund,
    checked,
    handleSelectAll,
    handleSelectProductRefund,
    handleChangeQuantity,
    filesRefun,
    setFilesRefun,
    ProductOrder,
    handleRequestRefund,
    updating,
    handleUpdateStatusOfOrder,
    orderRefundSorted,
    isComplain
}: Props) => {
    const [note, setNote] = useState<string>('')

    const handleChangeNoteForNormalFlow = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value)
    }

    const img_colmns: ColumnDef<OrderDetailResponse['ProductOrder'][number]> = useMemo(() => {
        return {
            accessorKey: 'Image',
            header: () => {
                return (
                    <div className='flex items-center justify-center gap-x-1'>
                        Hình ảnh
                        <BiSolidSortAlt />
                    </div>
                )
            },
            cell: ({
                row: {
                    original: { image }
                }
            }) => (
                <Flex justify={'center'} align={'center'}>
                    <Avatar src={image} fallback='A' />
                </Flex>
            )
        }
    }, [])

    const columns: ColumnDef<OrderDetailResponse['ProductOrder'][number]>[] = useMemo(() => {
        return [
            {
                accessorKey: 'Mã đơn hàng',
                header: () => {
                    return (
                        <div className='flex items-center gap-x-1'>
                            <Checkbox
                                checked={orderRefund.productOrders.size === checked.size}
                                onCheckedChange={handleSelectAll}
                            />
                        </div>
                    )
                },
                cell: ({
                    row: {
                        original: { id }
                    }
                }) => (
                    <div>
                        <Checkbox checked={checked.has(id)} onCheckedChange={handleSelectProductRefund(id)} />
                    </div>
                )
            },
            img_colmns,
            {
                accessorKey: 'Số lượng',
                header: () => {
                    return (
                        <div className='flex items-center justify-center gap-x-1 max-w-20 mx-auto'>
                            Số lượng
                            <BiSolidSortAlt />
                        </div>
                    )
                },
                cell: ({
                    row: {
                        original: { id }
                    }
                }) => (
                    <Flex justify={'center'} align={'center'} className='text-center'>
                        <TextField.Root
                            onChange={handleChangeQuantity(id)}
                            value={orderRefund.productOrders.get(id)?.quantity || 0}
                            disabled={!checked.has(id)}
                            className='flex-grow max-w-16'
                        />
                    </Flex>
                )
            }
        ]
    }, [checked, orderRefund])

    return (
        <>
            <h3>{OrderNextFlowLabel[new_flow]}</h3>
            <TextArea
                value={note}
                onChange={handleChangeNoteForNormalFlow}
                placeholder={isRefund ? 'Nhập lý do hoàn đổi sản phẩm' : 'Lưu ý của bạn'}
                autoComplete='none'
                translate='no'
                className='!bg-[#FAF9FA]'
            />
            <div>
                {isRequestRefund && (
                    <div className='space-y-5'>
                        <Table<OrderDetailResponse['ProductOrder'][number]>
                            columns={columns}
                            data={ProductOrder}
                            className='w-full h-full !rounded-6 overflow-hidden'
                            bodyClassName='bg-[#FAF9FA]'
                        />
                        <MultiUploadFile
                            className='bg-[#FAF9FA]'
                            min={1}
                            size={3}
                            total={5}
                            files={filesRefun}
                            setFiles={setFilesRefun}
                        />
                    </div>
                )}
            </div>
            <Flex justify={'end'}>
                <Button
                    type='button'
                    onClick={
                        isRequestRefund
                            ? handleRequestRefund(id, note)
                            : handleUpdateStatusOfOrder(
                                  id,
                                  new_flow,
                                  note,
                                  orderRefundSorted[orderRefundSorted.length - 1]?.id
                              ) || ''
                    }
                >
                    {updating.id == id && updating.isUpdating && <Spinner />}
                    {['Xác nhận', 'Yêu cầu hoàn hàng'][+isRequestRefund]}
                </Button>
            </Flex>
        </>
    )
}

export default OrderFlowForm
