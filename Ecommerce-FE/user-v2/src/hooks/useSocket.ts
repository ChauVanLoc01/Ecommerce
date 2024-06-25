import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { order_channel_socket } from 'src/constants/event'

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
        socket.on(order_channel_socket, (data) => {
            if (typeof data === 'string') {
                setIsCanOrder(true)
            } else {
                const { action } = data as { msg: string; action: boolean; result: any }
                if (action) {
                    toast.success('Đặt hàng thành công')
                } else {
                    toast.error('Lỗi! Đặt hàng không thành công')
                }
            }
        })

        socket.emit(order_channel_socket, actionId)

        return () => {
            socket.off(order_channel_socket, () => toast.info('Đã ngắt kết nối với order channel'))
        }
    }, [])

    return {
        socket,
        isCanOrder
    }
}

export default useSocket
