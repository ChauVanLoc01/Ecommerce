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
}

const VoucherUpdateStatus = ({ row, refetchAll }: VoucherUpdateStatusProps) => {
    const { mutate } = useMutation({
        mutationFn: VoucherApi.updateStatus,
        onSuccess: () => {
            refetchAll()
            toast.success('Cập nhật trạng thái thành công')
        },
        onError: () => {
            toast.error('Lỗi! Cập nhật trạng thái không thành công')
        }
    })

    const isActive = row.original.status === 'ACTIVE'

    const handleBlockStatus = () => mutate('BLOCK')

    const handleActiveStatus = () => mutate('ACTIVE')

    return (
        <Tooltip content={isActive ? 'Khóa' : 'Mở'}>
            <IconButton
                variant='soft'
                color={isActive ? 'red' : 'green'}
                onClick={isActive ? handleBlockStatus : handleActiveStatus}
            >
                {isActive ? <Cross2Icon /> : <LockOpen1Icon />}
            </IconButton>
        </Tooltip>
    )
}

export default VoucherUpdateStatus
