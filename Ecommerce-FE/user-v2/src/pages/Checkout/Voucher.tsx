import { ArrowBottomLeftIcon, Cross2Icon } from '@radix-ui/react-icons'
import {
    AlertDialog,
    Avatar,
    Badge,
    Button,
    Card,
    Flex,
    IconButton,
    Spinner,
    Text,
    TextField,
    Tooltip
} from '@radix-ui/themes'
import { useMutation, useQueries } from '@tanstack/react-query'
import { cloneDeep } from 'lodash'
import { useContext, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { VoucherFetching } from 'src/apis/voucher.api'
import { AppContext } from 'src/contexts/AppContext'
import { Voucher as VoucherType, VoucherWithCondition } from 'src/types/voucher.type'
import { convertCurrentcy } from 'src/utils/utils.ts'
import VoucherCard from './VoucherCard'

type VoucherProps = {
    selectedVoucher?: Record<string, VoucherType[]>
    setSelectedVoucher: React.Dispatch<React.SetStateAction<Record<string, VoucherType[]> | undefined>>
}

const Voucher = ({ selectedVoucher, setSelectedVoucher }: VoucherProps) => {
    const { ids } = useContext(AppContext)
    const [open, setOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const handleFocus = () => setTimeout(() => setOpen(true), 150)
    const [voucher, setVoucher] = useState<Record<string, VoucherWithCondition> | undefined>(undefined)

    const voucherQuery = useQueries({
        queries: (ids?.checked_storeIds || []).map((storeId) => ({
            queryKey: ['storeVoucher', storeId],
            queryFn: () => VoucherFetching.getVoucherByStoreId(storeId),
            refetchInterval: 1000 * 30
        })),
        combine: (result) => {
            if (!result.filter(Boolean).length) return undefined
            return result.reduce<Record<string, VoucherWithCondition[]>>((acum, data, idx) => {
                if (!data.data?.data?.result?.length) {
                    return acum
                }
                let storeId = ids?.checked_storeIds[idx] as string
                let tmp = data.data.data.result
                return {
                    ...acum,
                    [storeId]: tmp
                }
            }, {})
        }
    })

    const {
        data: searchVoucherData,
        mutate: searchVoucher,
        isPending: searchVoucherPending
    } = useMutation({
        mutationFn: VoucherFetching.searchVoucher
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

    const handleSearch = () => searchVoucher({ code: search, storesID: ids?.checked_storeIds || [] })

    const handleSelectVoucher = (storeId: string, voucherId: string) => {
        setVoucher((pre) => {
            return {
                ...pre,
                [storeId]: voucherQuery?.[storeId].find((voucher) => voucher.id === voucherId) as any
            }
        })
    }

    const handleConfirm = () => {
        if (voucher) {
            setVoucher(undefined)
            setSelectedVoucher((pre) => {
                Object.keys(voucher).forEach((storeId) => {
                    if (!pre) {
                        pre = {
                            [storeId]: [voucher[storeId]]
                        }
                        return
                    }
                    if (!pre[storeId].length) {
                        pre = {
                            ...pre,
                            [storeId]: [voucher[storeId]]
                        }
                    } else {
                        pre = {
                            ...pre,
                            [storeId]: [...pre[storeId], voucher[storeId]]
                        }
                    }
                })
                return cloneDeep(pre)
            })
            setOpen(false)
        }
    }

    const handleRemoveVoucher = (storeId: string, voucherId: string) => () => {
        setSelectedVoucher((pre) => {
            let vouchers = selectedVoucher?.[storeId]
            if (vouchers?.length == 1) {
                delete selectedVoucher?.[storeId]
            } else {
                vouchers = vouchers?.filter((item) => item.id != voucherId)
            }
            if (!Object.keys(pre as any).length) {
                return undefined
            }
            return cloneDeep(pre)
        })
    }

    return (
        <>
            <div className='p-24 rounded-8 border border-border/30 bg-[#FFFFFF] space-y-4'>
                <h3 className='font-semibold'>Bạn có mã giảm giá?</h3>
                <div className='flex justify-between items-center gap-x-2'>
                    <TextField.Root
                        className='flex-grow'
                        placeholder='Nhập mã giảm giá'
                        size={'3'}
                        onFocus={handleFocus}
                    />
                    <Button size={'3'} onClick={handleFocus}>
                        Áp dụng
                    </Button>
                </div>
                <div>
                    {selectedVoucher &&
                        Object.keys(selectedVoucher).map((storeId) => {
                            return selectedVoucher?.[storeId].map((voucher) => (
                                <Card>
                                    <Flex direction='column' width='100%' className='relative'>
                                        <Text weight='bold' size={'3'}>
                                            {voucher.title}
                                        </Text>
                                        <Flex gapX={'2'}>
                                            <Flex align={'center'}>
                                                <ArrowBottomLeftIcon />
                                                <Text size={'1'}>{voucher.percent}%</Text>
                                            </Flex>
                                            <Text size={'1'}>Tối đa {convertCurrentcy(voucher.maximum)}</Text>
                                        </Flex>
                                        <Flex mt={'2'} justify={'between'} align={'center'}>
                                            <Flex align={'center'} gapX={'1'}>
                                                <Text size={'2'}>Số lượng:</Text>
                                                <Text color='yellow' size={'2'}>
                                                    {voucher.currentQuantity}
                                                </Text>
                                            </Flex>
                                            <Text size={'1'} color='blue'>
                                                Chi tiết
                                            </Text>
                                        </Flex>
                                        <Flex className='absolute top-0 right-0 space-x-1'>
                                            <Badge size={'2'}>Đang sử dụng</Badge>
                                            <Tooltip content='Xóa'>
                                                <IconButton
                                                    variant='soft'
                                                    color='red'
                                                    size={'1'}
                                                    onClick={handleRemoveVoucher(storeId, voucher.id)}
                                                >
                                                    <Cross2Icon />
                                                </IconButton>
                                            </Tooltip>
                                        </Flex>
                                    </Flex>
                                </Card>
                            ))
                        })}
                </div>
            </div>
            <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Content maxWidth='550px' className='!rounded-8 space-y-4'>
                    <div className='space-y-1'>
                        <AlertDialog.Title>Mã giảm giá</AlertDialog.Title>
                        <div className='flex justify-between items-center gap-x-2'>
                            <TextField.Root
                                size={'3'}
                                className='flex-grow uppercase'
                                placeholder='Nhập mã giảm giá'
                                onChange={handleChange}
                                value={search}
                                type='text'
                            />
                            <Button size={'3'} onClick={handleSearch}>
                                {searchVoucherPending && <Spinner />}
                                Áp dụng
                            </Button>
                        </div>
                    </div>
                    {voucherQuery && Object.keys(voucherQuery).length ? (
                        <SimpleBar style={{ maxHeight: '317px', paddingBottom: '5px' }}>
                            <div className='space-y-2'>
                                {Object.keys(voucherQuery).map((storeId, idx) => (
                                    <div className='space-y-1' key={`voucher_card_${idx}`}>
                                        <VoucherCard
                                            key={`voucher_${storeId}_${idx}`}
                                            vouchers={voucherQuery[storeId]}
                                            storeId={storeId}
                                            handleSelectVoucher={handleSelectVoucher}
                                            select={voucher || {}}
                                            selectedVoucher={selectedVoucher}
                                        />
                                    </div>
                                ))}
                            </div>
                        </SimpleBar>
                    ) : (
                        <Flex justify={'center'} align={'center'} className='py-10'>
                            <Avatar
                                className='w-20 h-20'
                                fallback='voucher_empty'
                                src='https://cdn-icons-png.flaticon.com/512/11696/11696700.png'
                            />
                        </Flex>
                    )}
                    <Flex justify={'end'} gapX={'4'}>
                        <AlertDialog.Cancel>
                            <Button type='button' variant='outline' color='red' onClick={() => setVoucher(undefined)}>
                                Trở về
                            </Button>
                        </AlertDialog.Cancel>
                        <Button
                            type='button'
                            className='bg-blue text-white'
                            onClick={handleConfirm}
                            disabled={!voucher}
                        >
                            Xác nhận
                        </Button>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    )
}

export default Voucher
