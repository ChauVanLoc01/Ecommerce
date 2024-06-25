import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { channel, join_room, leave_room } from 'src/constants/event'

type UseSocketProps = {
    actionId: string
}

const useSocket = ({ actionId }: UseSocketProps) => {
    const { current: socket } = useRef(
        io(import.meta.env.VITE_SOCKET_ENPOINT, {
            autoConnect: false
        })
    )
    const [isCanOrder, setIsCanOrder] = useState<boolean>(false)

    useEffect(() => {
        socket.connect()

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect(() => {
        socket.on(join_room, (data) => {
            if (typeof data === 'string') {
                setIsCanOrder(true)
                toast.info(data)
            } else {
                const { action } = data as { msg: string; action: boolean; result: any }
                if (action) {
                    toast.success('Đặt hàng thành công')
                } else {
                    toast.error('Lỗi! Đặt hàng không thành công')
                }
            }
        })

        socket.emit(join_room, { type: channel.order, id: actionId })

        return () => {
            socket.off(join_room, () => toast.info('Đã ngắt kết nối với order channel'))
            socket.emit(leave_room, { type: channel.order, id: actionId })
        }
    }, [])

    return {
        socket,
        isCanOrder
    }
}

export default useSocket
