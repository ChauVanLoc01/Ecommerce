import { Cross2Icon, LockOpen1Icon } from '@radix-ui/react-icons'
import { Button, Dialog, Flex, IconButton, Spinner, Tooltip } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'
import { VoucherApi } from 'src/apis/voucher.api'
import { Voucher } from 'src/types/voucher.type'

type VoucherUpdateStatusProps = {
    row: Row<Voucher>
    refetchAll: () => void
    isDisable?: boolean
}

const VoucherUpdateStatus = ({ row, refetchAll, isDisable }: VoucherUpdateStatusProps) => {
    const [showConfirm, setShowConfirm] = useState<boolean>(false)
    const isActive = row.original.status === 'ACTIVE'

    const status = isActive ? 'BLOCK' : 'ACTIVE'
    const title = isActive ? 'Xác nhận khóa mã giảm giá?' : 'Mở khóa mã giảm giá?'
    const description = isActive
        ? 'Mọi người đều sẽ không nhìn thấy mã giảm giá này'
        : 'Mọi người đều có thể nhìn thấy mã giảm giá này'

    const { mutate, isPending } = useMutation({
        mutationFn: VoucherApi.updateStatus(row.original.id, status),
        onSuccess: () => {
            refetchAll()
            toast.success('Cập nhật trạng thái thành công')
        },
        onError: (err) => {
            if (isAxiosError(err)) {
                toast.error(err?.response?.data?.message || 'Cập nhật trạng thái thất bại')
            }
        }
    })

    return (
        <>
            <Tooltip content={isActive ? 'Khóa' : 'Mở khóa'}>
                <IconButton
                    variant='soft'
                    color={isActive ? 'red' : 'green'}
                    disabled={isDisable}
                    onClick={() => setShowConfirm(!showConfirm)}
                >
                    {isActive ? <Cross2Icon /> : <LockOpen1Icon />}
                </IconButton>
            </Tooltip>
            <Dialog.Root open={showConfirm} onOpenChange={setShowConfirm}>
                <Dialog.Content maxWidth='450px' className='rounded-8'>
                    <Dialog.Title>{title}</Dialog.Title>
                    <Dialog.Description>{description}</Dialog.Description>
                    <Flex gap='3' mt='4' justify='end'>
                        <Dialog.Close>
                            <Button variant='soft' color='gray'>
                                Trở về
                            </Button>
                        </Dialog.Close>
                        <Button type='button' className='bg-blue text-white' onClick={mutate as any}>
                            {isPending && <Spinner />}
                            Xác nhận
                        </Button>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </>
    )
}

export default VoucherUpdateStatus
