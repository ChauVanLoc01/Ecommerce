import { Avatar, Button, Checkbox, Flex, Spinner, TextArea, TextField } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { ColumnDef } from '@tanstack/react-table'
import { AxiosError, isAxiosError } from 'axios'
import { format } from 'date-fns'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { BiSolidSortAlt } from 'react-icons/bi'
import { FaQuestion } from 'react-icons/fa6'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import SimpleScrollbar from 'simplebar-react'
import { toast } from 'sonner'
import { OrderFetching } from 'src/apis/order'
import { UploadApi } from 'src/apis/upload_file.api'
import MultiUploadFile from 'src/components/MultiUploadFile/MultiUploadFile'
import Table from 'src/components/Table'
import { defaultFormat } from 'src/constants/date-format'
import { order_next_flow, OrderFlowEnum, OrderFlowLabel, OrderNextFlowLabel } from 'src/constants/order-status'
import { CreateOrderRefund, OrderDetailResponse, ProductOrder, ProductOrderRefund } from 'src/types/order.type'
import { cn } from 'src/utils/utils.ts'

type OrderFlowProps = {
    orderData: OrderDetailResponse
    orderRefetch: (options?: RefetchOptions) => Promise<QueryObserverResult<OrderDetailResponse, Error>>
}

const OrderFlow = ({ orderData, orderRefetch }: OrderFlowProps) => {
    let { OrderFlow, ProductOrder } = orderData

    const [filesRefun, setFilesRefun] = useState<{ files: Map<number, File>; primary?: number }>({ files: new Map() })
    const [note, setNote] = useState<string>('')
    const [height, setHeight] = useState<number>(0)
    const [orderRefund, setOrderRefund] = useState<
        Omit<CreateOrderRefund, 'productOrders'> & {
            productOrders: Map<string, Pick<ProductOrder, 'id' | 'quantity'>>
        }
    >({
        title: '',
        description: '',
        materials: [],
        productOrders: new Map(ProductOrder.map(({ quantity, id }) => [id, { id, quantity, note: '' }]))
    })
    const [checked, setChecked] = useState<Set<string>>(new Set())
    const [isUpdating, setIsUpdating] = useState<boolean>(false)

    const { mutate: updateStatusOrderMutation } = useMutation({
        mutationFn: OrderFetching.updateStatusOrder(orderData.id),
        onSuccess: () => {
            orderRefetch()
            toast.success('Cập nhật trạng thái đơn hàng thành công')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const { mutate: requestRefundMutation } = useMutation({
        mutationFn: OrderFetching.requestRefund(orderData.id),
        onSuccess: () => {
            orderRefetch()
            setIsUpdating(true)
            toast.success('Đã gửi yêu cầu hoàn đổi sản đến cửa hàng')
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Yêu cầu hoàn đổi thất bại')
                return
            }
            toast.error('Lỗi')
        }
    })

    const { mutateAsync: uploadMultiFileMutation } = useMutation({
        mutationFn: UploadApi.updateMultipleFile
    })

    const handleUpdateStatusOfOrder = (status: OrderFlowEnum, orderRefundId?: string) => () => {
        updateStatusOrderMutation({
            status,
            note,
            orderRefundId
        })
    }

    const handleRequestRefund = () => {
        if (!checked.size) {
            toast.warning('Bạn cần chọn sản phẩm để hoàn hàng')
            return
        }
        if (!filesRefun.files.size) {
            toast.warning('Bạn cần cung cấp ít nhất 1 hình ảnh để có thể tạo đơn hoàn đổi')
            return
        }
        setIsUpdating(true)
        const formData = new FormData()
        filesRefun.files.forEach((file) => {
            formData.append('files', file)
        })
        uploadMultiFileMutation(formData)
            .then((result) => {
                let productOrders: ProductOrderRefund[] = []
                checked.forEach((productOrderId) => {
                    productOrders.push({
                        productOrderId,
                        quantity: orderRefund.productOrders.get(productOrderId)?.quantity as number
                    })
                })
                requestRefundMutation({
                    title: 'Yêu cầu hoàn đổi',
                    description: 'Sản phẩm bị lỗi',
                    materials: result.data.result.map((url) => ({ url, type: 'image' })),
                    productOrders
                })
                setIsUpdating(false)
            })
            .catch((error) => {
                toast.error((error as AxiosError)?.message || 'Upload file không thành công')
            })
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setChecked(new Set(orderData.ProductOrder.map(({ id }) => id)))
        } else {
            setChecked(new Set())
        }
    }

    const handleSelectProductRefund = (productOrderId: string, isChecked: boolean) => {
        setChecked((pre) => {
            if (isChecked) {
                pre.add(productOrderId)
            } else {
                pre.delete(productOrderId)
            }
            return new Set(pre)
        })
    }

    const handleChangeNoteForNormalFlow = debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value)
    }, 150)

    const columns: ColumnDef<OrderDetailResponse['ProductOrder'][number]>[] = [
        {
            accessorKey: 'Mã đơn hàng',
            header: () => {
                return (
                    <div className='flex items-center gap-x-1'>
                        <Checkbox
                            checked={orderRefund.productOrders.size === checked.size}
                            onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
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
                    <Checkbox
                        checked={checked.has(id)}
                        onCheckedChange={(checked) => handleSelectProductRefund(id, checked as boolean)}
                    />
                </div>
            )
        },
        {
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
                    <Avatar src={image} fallback={'A'} size={'4'} />
                </Flex>
            )
        },
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
                    original: { productId }
                }
            }) => (
                <Flex justify={'center'} align={'center'} className='text-center'>
                    <TextField.Root
                        type='number'
                        value={orderRefund.productOrders.get(productId)?.quantity || 0}
                        max={orderRefund.productOrders.get(productId)?.quantity || 0}
                        min={0}
                        disabled={!checked.has(productId)}
                        className='flex-grow max-w-16'
                    />
                </Flex>
            )
        }
    ]

    useEffect(() => {
        let dataList = document.querySelector('#order-detail-list')

        if (dataList) {
            setHeight(dataList.clientHeight)
        }
    }, [])

    useEffect(() => {
        return () => handleChangeNoteForNormalFlow.cancel()
    }, [handleChangeNoteForNormalFlow])

    return (
        <SimpleScrollbar style={{ maxHeight: `${height}px` }} forceVisible={false}>
            <VerticalTimeline layout='1-column-left' lineColor='#7BB2DE' className='!py-2 !pr-5 !space-y-4'>
                {OrderFlow.sort((a, b) => (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any)).map(
                    (flow, idx) => {
                        let isLast = OrderFlow.length === idx + 1
                        return (
                            <VerticalTimelineElement
                                key={flow.id}
                                className='vertical-timeline-element--work !mb-0'
                                position='right'
                                contentStyle={{ background: '#91A4D0', color: '#FBF9F9' }}
                                contentArrowStyle={{ borderRight: '7px solid  #91A4D0' }}
                                date={format(flow.createdAt, defaultFormat)}
                                dateClassName='!pb-0 text-[#FBF9F9]'
                                iconStyle={{
                                    background: isLast ? '#DE5B18' : '#91A4D0'
                                }}
                                iconClassName={cn(
                                    '!size-4 !translate-x-2/3 !translate-y-2/3 !flex justify-center items-center'
                                )}
                            >
                                <h3>{OrderFlowLabel[flow.status as keyof typeof OrderFlowLabel]}</h3>
                            </VerticalTimelineElement>
                        )
                    }
                )}
                {order_next_flow?.[OrderFlow[OrderFlow.length - 1].status as keyof typeof order_next_flow] &&
                    order_next_flow[OrderFlow[OrderFlow.length - 1].status as keyof typeof order_next_flow].map(
                        (new_flow) => {
                            let isRefund = [OrderFlowEnum.REQUEST_REFUND, OrderFlowEnum.RE_OPEN_REFUND].includes(
                                new_flow
                            )
                            let orderRefundSorted = orderData.OrderRefund.sort(
                                (a, b) => (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any)
                            )
                            return (
                                <VerticalTimelineElement
                                    key={new_flow}
                                    className='vertical-timeline-element--work !mb-0'
                                    position='right'
                                    contentStyle={{ background: '#2989C3', color: '#FAF9FA' }}
                                    contentArrowStyle={{ borderRight: '7px solid  #2989C3' }}
                                    dateClassName='!pb-0 text-[#FAF9FA]'
                                    iconStyle={{ background: 'white' }}
                                    iconClassName={cn(
                                        '!size-4 !translate-x-1/2 !translate-y-1/2 !flex justify-center items-center'
                                    )}
                                    icon={<FaQuestion />}
                                >
                                    <div className='space-y-2'>
                                        <h3>{OrderNextFlowLabel[new_flow as keyof typeof OrderFlowLabel]}</h3>
                                        <TextArea
                                            value={note}
                                            onChange={handleChangeNoteForNormalFlow}
                                            placeholder={isRefund ? 'Nhập lý do hoàn đổi sản phẩm' : 'Lưu ý của bạn'}
                                            autoComplete='none'
                                            translate='no'
                                            className='!bg-[#FAF9FA]'
                                        />

                                        <div>
                                            {isRefund && (
                                                <div className='space-y-5'>
                                                    <Table<OrderDetailResponse['ProductOrder'][number]>
                                                        columns={columns}
                                                        data={ProductOrder}
                                                        className='w-full h-full !rounded-6 overflow-hidden'
                                                        bodyClassName='bg-[#FAF9FA]'
                                                    />
                                                    <MultiUploadFile
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
                                                    isRefund
                                                        ? handleRequestRefund
                                                        : handleUpdateStatusOfOrder(
                                                              new_flow,
                                                              orderRefundSorted[orderRefundSorted.length - 1].id
                                                          )
                                                }
                                            >
                                                {isUpdating && <Spinner />}
                                                {['Xác nhận', 'Yêu cầu hoàn hàng'][+isRefund]}
                                            </Button>
                                        </Flex>
                                    </div>
                                </VerticalTimelineElement>
                            )
                        }
                    )}
            </VerticalTimeline>
        </SimpleScrollbar>
    )
}

export default OrderFlow
