import { Cross2Icon, LockOpen1Icon } from '@radix-ui/react-icons'
import { IconButton, Tooltip } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { Row } from '@tanstack/react-table'
import { toast } from 'sonner'
import { VoucherApi } from 'src/apis/voucher.api'
import { Voucher } from 'src/types/voucher.type'

type VoucherUpdateStatusProps = {
    row: Row<Voucher>
    refetchAll: () => void
    isDisable?: boolean
}

const VoucherUpdateStatus = ({ row, refetchAll, isDisable }: VoucherUpdateStatusProps) => {
    const isActive = row.original.status === 'ACTIVE'

    const { mutate } = useMutation({
        mutationFn: VoucherApi.updateStatus(row.original.id, isActive ? 'BLOCK' : 'ACTIVE'),
        onSuccess: () => {
            refetchAll()
            toast.success('Cập nhật trạng thái thành công')
        },
        onError: () => {
            toast.error('Lỗi! Cập nhật trạng thái không thành công')
        }
    })

    return (
        <Tooltip content={isActive ? 'Khóa' : 'Mở'}>
            <IconButton variant='soft' color={isActive ? 'red' : 'green'} onClick={mutate as any} disabled={isDisable}>
                {isActive ? <Cross2Icon /> : <LockOpen1Icon />}
            </IconButton>
        </Tooltip>
    )
}

export default VoucherUpdateStatus
