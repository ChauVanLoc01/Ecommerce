import { ArrowBottomLeftIcon, Cross2Icon } from '@radix-ui/react-icons'
import { AlertDialog, Badge, Button, Card, Flex, IconButton, Spinner, Text, TextField, Tooltip } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { toast } from 'sonner'
import { VoucherFetching } from 'src/apis/voucher.api'
import { AppContext } from 'src/contexts/AppContext'
import { RefreshStore } from 'src/types/store.type'
import { VoucherWithCondition } from 'src/types/voucher.type'
import { convertCurrentcy } from 'src/utils/utils.ts'
import VoucherCard from './VoucherCard'

type VoucherProps = {
    refreshStores: RefreshStore
    voucherLatest:
        | {
              [x: string]: {
                  [voucherId: string]: VoucherWithCondition
              }
          }
        | undefined
    voucherIds:
        | {
              [storeId: string]: string
          }
        | undefined
    setVoucherIds: React.Dispatch<
        React.SetStateAction<
            | {
                  [storeId: string]: string
              }
            | undefined
        >
    >
}

const Voucher = ({ refreshStores, voucherLatest, setVoucherIds, voucherIds }: VoucherProps) => {
    const { ids } = useContext(AppContext)
    const [open, setOpen] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('')
    const handleFocus = () => setTimeout(() => setOpen(true), 150)
    const [selects, setselects] = useState<
        | {
              [storeId: string]: string
          }
        | undefined
    >(voucherIds)

    const {
        data: searchVoucherData,
        mutate: searchVoucher,
        isPending: searchVoucherPending
    } = useMutation({
        mutationFn: VoucherFetching.searchVoucher
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)

    const handleSearch = () => searchVoucher({ code: search, storesID: ids?.storeCheckedIds as string[] })

    const handleSelectVoucher = (storeId: string) => (voucherId: string) => {
        setselects((pre) => {
            if (!pre) return { [storeId]: voucherId }
            return {
                ...pre,
                [storeId]: voucherId
            }
        })
    }

    const handleConfirm = () => {
        setVoucherIds(selects)
        setselects(undefined)
        setOpen(false)
        toast.success('Áp dụng mã giảm giá thành công')
    }

    const handleRemoveVoucher = (storeId: string, voucherId: string) => () => {
        if (voucherLatest && voucherIds && voucherIds?.[storeId] === voucherId) {
            setVoucherIds((pre) => {
                delete pre?.[storeId]
                return {
                    ...pre
                }
            })
        }
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
                {voucherIds && voucherLatest && (
                    <div>
                        {Object.keys(voucherIds).map((storeId) => (
                            <Card>
                                <Flex direction='column' width='100%' className='relative'>
                                    <Text weight='bold' size={'3'}>
                                        {voucherLatest[storeId][voucherIds[storeId]].title}
                                    </Text>
                                    <Flex gapX={'2'}>
                                        <Flex align={'center'}>
                                            <ArrowBottomLeftIcon />
                                            <Text size={'1'}>
                                                {voucherLatest[storeId][voucherIds[storeId]].percent}%
                                            </Text>
                                        </Flex>
                                        <Text size={'1'}>
                                            Tối đa{' '}
                                            {convertCurrentcy(voucherLatest[storeId][voucherIds[storeId]].maximum)}
                                        </Text>
                                    </Flex>
                                    <Flex mt={'2'} justify={'between'} align={'center'}>
                                        <Flex align={'center'} gapX={'1'}>
                                            <Text size={'2'}>Số lượng:</Text>
                                            <Text color='yellow' size={'2'}>
                                                {voucherLatest[storeId][voucherIds[storeId]].currentQuantity}
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
                                                onClick={handleRemoveVoucher(
                                                    storeId,
                                                    voucherLatest[storeId][voucherIds[storeId]].id
                                                )}
                                            >
                                                <Cross2Icon />
                                            </IconButton>
                                        </Tooltip>
                                    </Flex>
                                </Flex>
                            </Card>
                        ))}
                    </div>
                )}
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
                    {voucherLatest && (
                        <SimpleBar style={{ maxHeight: '317px', paddingBottom: '5px' }}>
                            <div className='space-y-2'>
                                {Object.keys(voucherLatest).map((storeId, idx) => (
                                    <div className='space-y-1' key={idx}>
                                        <VoucherCard
                                            key={storeId}
                                            vouchers={Object.values(voucherLatest[storeId])}
                                            store={refreshStores[storeId]}
                                            voucherId={
                                                voucherIds && Object.keys(voucherLatest).includes(storeId)
                                                    ? voucherIds[storeId]
                                                    : undefined
                                            }
                                            handleSelectVoucher={handleSelectVoucher(storeId)}
                                            select={selects && selects[storeId]}
                                        />
                                    </div>
                                ))}
                            </div>
                        </SimpleBar>
                    )}
                    <Flex justify={'end'} gapX={'4'}>
                        <AlertDialog.Cancel>
                            <Button type='button' variant='outline' color='red' onClick={() => setselects(undefined)}>
                                Hủy
                            </Button>
                        </AlertDialog.Cancel>
                        <Button type='submit' className='bg-blue text-white' onClick={handleConfirm}>
                            Xác nhận
                        </Button>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    )
}

export default Voucher
