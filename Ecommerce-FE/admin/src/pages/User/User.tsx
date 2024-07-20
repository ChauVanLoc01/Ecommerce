import { useMutation, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { toast } from 'sonner'
import { user_api } from 'src/apis/user.api'
import { queryClient } from 'src/routes/main.route'
import { User as UserType } from 'src/types/auth.type'
import { UserQuery } from 'src/types/user.type'
import LayoutProfile from '../Profile/LayoutProfile'
import Detail from './Detail'
import UpdateStatus from './UpdateStatus'
import StoreHeader from './UserHeader'
import UserTable from './UserTable'

const User = () => {
    const [query, setQuery] = useState<UserQuery>({ page: 1, limit: 10 })
    const [updateStatusOpen, setUpdateStatusOpen] = useState<boolean>(false)
    const [detailOpen, setDetailOpen] = useState<boolean>(false)
    const [date, setDate] = useState<DateRange | undefined>({ from: query?.start_date, to: query?.end_date })

    const [selectedUser, setSelectedUser] = useState<UserType | undefined>(undefined)

    const { data: users, refetch: refetchUser } = useQuery({
        queryKey: ['users', { limit: 10, page: 1 }],
        queryFn: user_api.getUsers(query),
        select: (data) => data.data
    })

    const { mutate: updateStatus } = useMutation({
        mutationFn: user_api.updateStatusOfUser(selectedUser?.id || ''),
        onSuccess: () => {
            toast.success('Cập nhật trạng thái thành công')
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (err) => {
            if (isAxiosError(err)) {
                toast.error(err.response?.data?.msg || 'Cập nhật trạng thái thất bại')
            }
        }
    })

    useEffect(() => {
        if (Object.keys(query).length > 2) {
            refetchUser()
        }
    }, [query])

    return (
        <LayoutProfile title='Quản lý người dùng' isFullHeight>
            <StoreHeader
                pagination={{ page: users?.result.query.page || 0, page_size: users?.result.query.page_size || 0 }}
                date={date}
                setDate={setDate}
                setQuery={setQuery}
            />
            <UserTable
                setDetailOpen={setDetailOpen}
                setStatusUpdateOpen={setUpdateStatusOpen}
                setSelectedUser={setSelectedUser}
                users={users?.result?.data || []}
            />
            <UpdateStatus
                open={updateStatusOpen}
                setOpen={setUpdateStatusOpen}
                selectedUser={selectedUser}
                updateStatus={updateStatus}
            />
            <Detail open={detailOpen} setOpen={setDetailOpen} />
        </LayoutProfile>
    )
}

export default User
