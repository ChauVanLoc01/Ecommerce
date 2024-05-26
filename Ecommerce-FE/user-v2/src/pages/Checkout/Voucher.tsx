import { AlertDialog, Button, Flex, TextField } from '@radix-ui/themes'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { StoreFetching } from 'src/apis/store'
import { VoucherFetching } from 'src/apis/voucher.api'
import { AppContext } from 'src/contexts/AppContext'
import VoucherCard from './VoucherCard'

const Voucher = () => {
    const { products } = useContext(AppContext)
    const [open, setOpen] = useState<boolean>(false)
    const handleFocus = () => setTimeout(() => setOpen(true), 150)

    const storesVoucher = useQueries({
        queries: Object.keys(products.products)
            .filter((e) => products.products[e].some((x) => x.checked))
            .map((e) => ({
                queryKey: ['storeVoucher', e],
                queryFn: () => VoucherFetching.getVoucherByStoreId(e),
                refetchInterval: 1000 * 10
            }))
    })

    const { data: refreshStores } = useQuery({
        queryKey: ['refreshStore', JSON.stringify(Object.keys(products.products))],
        queryFn: () => StoreFetching.refreshStore(Object.keys(products.products)),
        refetchInterval: 1000 * 60 * 3,
        enabled: false,
        select: (data) => data.data.result
    })

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
            </div>
            <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Content maxWidth='550px' className='!rounded-8 space-y-4'>
                    <AlertDialog.Title>Mã giảm giá</AlertDialog.Title>
                    <div className='flex justify-between items-center gap-x-2'>
                        <TextField.Root
                            size={'3'}
                            className='flex-grow'
                            placeholder='Nhập mã giảm giá'
                            onFocus={handleFocus}
                        />
                        <Button size={'3'} onClick={handleFocus}>
                            Áp dụng
                        </Button>
                    </div>
                    <div>{/* <VoucherCard /> */}</div>

                    <SimpleBar style={{ maxHeight: '317px', paddingBottom: '5px' }}>
                        <div className='space-y-2'>
                            {storesVoucher.map((store, idx) => (
                                <div className='space-y-1'>
                                    <VoucherCard
                                        key={idx}
                                        vouchers={store.data?.data.result || []}
                                        storeName={
                                            refreshStores
                                                ? refreshStores[Object.keys(products.products)[idx]].name
                                                : 'A'
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </SimpleBar>
                    <Flex justify={'end'} gapX={'4'}>
                        <AlertDialog.Cancel>
                            <Button type='button' variant='outline' color='red'>
                                Hủy
                            </Button>
                        </AlertDialog.Cancel>
                        <Button type='submit' className='bg-blue text-white'>
                            Xác nhận
                        </Button>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    )
}

export default Voucher
