import { InfoCircledIcon } from '@radix-ui/react-icons'
import { AlertDialog, Badge, Button, DataList, Flex, IconButton, Text, TextArea, Tooltip } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { format, formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { ProductApi } from 'src/apis/product.api'
import { VoucherApi } from 'src/apis/voucher.api'
import { formatDefault } from 'src/constants/date.constants'
import { UserStatus } from 'src/constants/order.status'
import { voucher_label } from 'src/constants/voucher.constant'
import { Voucher } from 'src/types/voucher.type'
import { convertCurrentcy } from 'src/utils/utils'

type VoucherDetailProps = {
    voucher: Voucher
}

const VoucherDetail = ({ voucher }: VoucherDetailProps) => {
    const [open, setOpen] = useState<boolean>(false)

    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: ProductApi.getAllCategories,
        select: (data) => data.data.result
    })

    const { data: categoryConditional } = useQuery({
        queryKey: [
            'category_conditional',
            { conditionalCategoryId: voucher.categoryConditionId, voucherId: voucher.id }
        ],
        queryFn: VoucherApi.getConditionalCategory(voucher.categoryConditionId),
        enabled: !!voucher.categoryConditionId,
        select: (data) => data.data.result
    })

    const { data: priceConditional } = useQuery({
        queryKey: ['price_conditional', { conditionalPriceId: voucher.priceConditionId, voucherId: voucher.id }],
        queryFn: VoucherApi.getConditionalPrice(voucher.priceConditionId),
        enabled: !!voucher.priceConditionId,
        select: (data) => data.data.result
    })

    const category_name = categoriesData?.find((category) => category.shortname == categoryConditional)?.name

    return (
        <>
            <Tooltip content='Chỉnh sửa'>
                <IconButton
                    onClick={() => setOpen(!open)}
                    variant='soft'
                    color='orange'
                    disabled={['CANCEL', 'SUCCESS'].includes(voucher.status)}
                >
                    <InfoCircledIcon />
                </IconButton>
            </Tooltip>
            <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Content maxWidth='600px' className='!rounded-8'>
                    <AlertDialog.Title>Chi tiết mã giảm giá</AlertDialog.Title>
                    <DataList.Root>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Mã code</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Badge size={'3'}>{voucher.code}</Badge>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Tiêu đề</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <TextArea value={voucher.title} className='flex-grow' disabled />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Mô tả</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <TextArea value={voucher.description} className='flex-grow' disabled />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>% giảm</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Text>{voucher.percent}%</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Giảm tối đa</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Text>{convertCurrentcy(voucher.maximum)}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Đã sử dụng</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Text>{voucher.initQuantity - voucher.currentQuantity}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Số lượng hiện có</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Text>{voucher.currentQuantity}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Số lượng khởi tạo</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Text>{voucher.initQuantity}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Trạng thái</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Badge color={UserStatus[voucher.status].color as any} size={'3'}>
                                    {voucher_label[voucher.status as keyof typeof voucher_label]}
                                </Badge>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Bắt đầu</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Flex gapX={'2'}>
                                    <Text>{format(voucher.startDate, formatDefault)}</Text>
                                    <Text className='italic text-gray-400'>
                                        ({formatDistanceToNow(voucher.startDate)})
                                    </Text>
                                </Flex>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Kết thúc</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Flex gapX={'2'}>
                                    <Text>{format(voucher.endDate, formatDefault)}</Text>
                                    <Text className='italic text-gray-400'>
                                        ({formatDistanceToNow(voucher.endDate)})
                                    </Text>
                                </Flex>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Điều kiện danh mục</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Badge size={'3'} className='capitalize' color='blue'>
                                    {category_name}
                                </Badge>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text className='w-[170px]'>Giá trị đơn hàng tối thiểu phải đạt</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Text>{voucher.priceConditionId}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text className='w-[170px]'>Giá trị mỗi một sản phẩm phải đạt</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Text>{voucher.priceConditionId}</Text>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                    <Flex gapX='3' mt='5' justify='end'>
                        <AlertDialog.Cancel>
                            <Button type='button' variant='outline' color='red'>
                                Trở về
                            </Button>
                        </AlertDialog.Cancel>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    )
}

export default VoucherDetail
