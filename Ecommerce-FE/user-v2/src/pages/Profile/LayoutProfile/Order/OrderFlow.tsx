import { Flex, Grid, Text, TextArea } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse, isAxiosError } from 'axios'
import { format } from 'date-fns'
import { cloneDeep } from 'lodash'
import { useEffect, useState } from 'react'
import { FaQuestion } from 'react-icons/fa6'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import SimpleScrollbar from 'simplebar-react'
import { toast } from 'sonner'
import { OrderFetching } from 'src/apis/order'
import { UploadApi } from 'src/apis/upload_file.api'
import Avatar from 'src/components/Avatar/Avatar'
import { defaultFormat } from 'src/constants/date-format'
import { order_next_flow, OrderFlowEnum, OrderFlowLabel } from 'src/constants/order-status'
import {
    CreateOrderRefund,
    OrderDetailResponse,
    OrderResponse,
    ProductOrder,
    ProductOrderRefund
} from 'src/types/order.type'
import { Return } from 'src/types/return.type'
import { cn } from 'src/utils/utils.ts'
import OrderFlowForm from './OrderFlowForm'

type OrderFlowProps = {
    orderData: OrderDetailResponse
    orderRefetch: (options?: RefetchOptions) => Promise<QueryObserverResult<OrderDetailResponse, Error>>
    refetch: (
        options?: RefetchOptions
    ) => Promise<QueryObserverResult<AxiosResponse<Return<OrderResponse>, any>, Error>>
}

const OrderFlow = ({ orderData, orderRefetch, refetch }: OrderFlowProps) => {
    let { OrderFlow, ProductOrder } = orderData

    const [filesRefun, setFilesRefun] = useState<{ files: Map<number, File>; primary?: number }>({ files: new Map() })
    const [height, setHeight] = useState<number>(0)
    const [orderRefund, setOrderRefund] = useState<
        Omit<CreateOrderRefund, 'productOrders'> & {
            productOrders: Map<string, Pick<ProductOrder, 'id' | 'quantity'> & { original_quantity: number }>
        }
    >({
        title: '',
        description: '',
        materials: [],
        productOrders: new Map(
            ProductOrder.map(({ quantity, id }) => [id, { id, original_quantity: quantity, quantity, note: '' }])
        )
    })
    const [checked, setChecked] = useState<Set<string>>(new Set())
    const [updating, setUpdating] = useState<{ id?: number; isUpdating: boolean }>({ isUpdating: false })

    const { mutateAsync: updateStatusOrderMutation } = useMutation({
        mutationFn: OrderFetching.updateStatusOrder(orderData.id),
        onSuccess: () => {
            toast.success('Cập nhật trạng thái đơn hàng thành công')
            orderRefetch()
            refetch()
        },
        onError: (error) => {
            if (isAxiosError(error)) {
                toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại')
            }
        }
    })

    const { mutate: requestRefundMutation } = useMutation({
        mutationFn: OrderFetching.requestRefund(orderData.id),
        onSuccess: () => {
            toast.success('Đã gửi yêu cầu hoàn đổi sản đến cửa hàng')
            orderRefetch()
            refetch()
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

    const handleUpdateStatusOfOrder =
        (idx: number, status: OrderFlowEnum, note: string, orderRefundId?: string) => () => {
            setUpdating({ id: idx, isUpdating: true })
            updateStatusOrderMutation({
                status,
                note,
                orderRefundId
            }).then(() => setUpdating({ id: idx, isUpdating: false }))
        }

    const handleRequestRefund = (idx: number, note: string) => () => {
        if (!checked.size) {
            toast.warning('Bạn cần chọn sản phẩm để hoàn hàng')
            return
        }
        if (!filesRefun.files.size) {
            toast.warning('Bạn cần cung cấp ít nhất 1 hình ảnh để có thể tạo đơn hoàn đổi')
            return
        }
        setUpdating({ id: idx, isUpdating: true })
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
                    description: note,
                    materials: result.data.result.map((url) => ({ url, type: 'image' })),
                    productOrders
                })
                orderRefetch()
                setUpdating({ id: idx, isUpdating: false })
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

    const handleSelectProductRefund = (productOrderId: string) => (isChecked: boolean) => {
        setChecked((pre) => {
            if (isChecked) {
                pre.add(productOrderId)
            } else {
                pre.delete(productOrderId)
            }
            return new Set(pre)
        })
    }

    const handleChangeQuantity = (productId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = +e.target.value.replace(/\D+/, '')
        setOrderRefund((pre) => {
            let tmp = pre.productOrders.get(productId)
            if (tmp) {
                pre.productOrders.set(productId, { ...tmp, quantity: Math.min(value || 1, tmp?.original_quantity) })
            }
            return cloneDeep(pre)
        })
    }

    useEffect(() => {
        let dataList = document.querySelector('#order-detail-list')

        if (dataList) {
            setHeight(dataList.clientHeight)
        }
    }, [])

    return (
        <SimpleScrollbar style={{ maxHeight: `${height}px` }} forceVisible={false}>
            <VerticalTimeline layout='1-column-left' lineColor='#7BB2DE' className='!py-2 !pr-5 !space-y-4'>
                {OrderFlow.sort((a, b) => (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any)).map(
                    (flow, idx) => {
                        let isLast = OrderFlow.length === idx + 1
                        let isRequestRefund = flow.status === OrderFlowEnum.REQUEST_REFUND
                        let orderRefund = isRequestRefund
                            ? orderData?.OrderRefund.find((refund) => flow?.orderRefundId === refund.id)
                            : undefined
                        return (
                            <VerticalTimelineElement
                                key={flow.id}
                                className='vertical-timeline-element--work !mb-0'
                                position='right'
                                contentStyle={{ background: '#91A4D0', color: '#FBF9F9' }}
                                contentArrowStyle={{ borderRight: '7px solid  #91A4D0' }}
                                date={format(flow?.createdAt, defaultFormat)}
                                dateClassName='!pb-0 text-[#FBF9F9]'
                                iconStyle={{
                                    background: isLast ? '#DE5B18' : '#91A4D0'
                                }}
                                iconClassName={cn(
                                    '!size-4 !translate-x-2/3 !translate-y-2/3 !flex justify-center items-center'
                                )}
                            >
                                <h3>{OrderFlowLabel[flow.status as keyof typeof OrderFlowLabel]}</h3>
                                {!isRequestRefund && (
                                    <div>
                                        <Text size={'2'}>Ghi Chú</Text>
                                        <TextArea
                                            value={flow?.note}
                                            autoComplete='none'
                                            translate='no'
                                            className='!bg-[#FAF9FA]'
                                            disabled
                                        />
                                    </div>
                                )}

                                {isRequestRefund && orderRefund && (
                                    <div className='space-y-3 mt-3'>
                                        <Flex direction={'column'} className='space-y-1'>
                                            <Text size={'2'}>Mô tả chi tiết</Text>
                                            <TextArea disabled value={orderRefund?.description} />
                                        </Flex>
                                        <Grid columns={'4'} gap={'3'}>
                                            {orderRefund.RefundMaterial.map(({ url }) => (
                                                <Avatar
                                                    fallback='Material'
                                                    src={url}
                                                    className='!w-full !h-auto object-cover flex-grow'
                                                />
                                            ))}
                                        </Grid>
                                    </div>
                                )}
                            </VerticalTimelineElement>
                        )
                    }
                )}
                {order_next_flow?.[OrderFlow[OrderFlow.length - 1].status as keyof typeof order_next_flow] &&
                    order_next_flow[OrderFlow[OrderFlow.length - 1].status as keyof typeof order_next_flow].map(
                        (new_flow, id) => {
                            if (
                                !orderData.numberOfRefund &&
                                [OrderFlowEnum.REQUEST_REFUND, OrderFlowEnum.RE_OPEN_REFUND].includes(new_flow)
                            ) {
                                return <></>
                            }
                            let isRefund = [
                                OrderFlowEnum.REQUEST_REFUND,
                                OrderFlowEnum.RE_OPEN_REFUND,
                                OrderFlowEnum.CLOSE_REFUND,
                                OrderFlowEnum.CANCEL_REFUND
                            ].includes(new_flow)
                            let isComplain = new_flow === OrderFlowEnum.NOT_RECEIVED
                            let isRequestRefund =
                                isRefund &&
                                [
                                    OrderFlowEnum.REQUEST_REFUND,
                                    OrderFlowEnum.REFUND_SHIPPING_SUCCESS,
                                    OrderFlowEnum.RE_OPEN_REFUND
                                ].includes(new_flow)
                            let orderRefundSorted = isRefund
                                ? orderData.OrderRefund.sort(
                                      (a, b) => (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any)
                                  )
                                : []
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
                                        <OrderFlowForm
                                            ProductOrder={ProductOrder}
                                            checked={checked}
                                            filesRefun={filesRefun}
                                            setFilesRefun={setFilesRefun}
                                            handleChangeQuantity={handleChangeQuantity}
                                            handleSelectAll={handleSelectAll}
                                            handleSelectProductRefund={handleSelectProductRefund}
                                            isRefund={isRefund}
                                            isRequestRefund={isRequestRefund}
                                            new_flow={new_flow}
                                            orderRefund={orderRefund}
                                            handleRequestRefund={handleRequestRefund}
                                            handleUpdateStatusOfOrder={handleUpdateStatusOfOrder}
                                            id={id}
                                            orderRefundSorted={orderRefundSorted}
                                            updating={updating}
                                            isComplain={isComplain}
                                        />
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
