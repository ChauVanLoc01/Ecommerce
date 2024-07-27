import { useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { channel, current_sale_promotion, join_room, leave_room } from 'src/constants/event'
import { AppContext } from 'src/contexts/AppContext'
import { SocketReturn } from 'src/types/socket.type'

type UseSocketProps = {
    actionId: string
}

const useSocket = ({ actionId }: UseSocketProps) => {
    const { toastIdRef, setCurrentSaleId } = useContext(AppContext)
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
        socket.on(join_room, (isOk: boolean) => {
            setIsCanOrder(isOk)
        })
        socket.on(channel.order, (res: SocketReturn<any>) => {
            if (res.action) {
                toast.dismiss(toastIdRef)
                setTimeout(() => {
                    toast.success(res.msg)
                }, 500)
            } else {
                toast.error(res.msg)
            }
        })
        socket.on(channel.current_sale_promotion, (currentId: string) => {
            setCurrentSaleId(currentId)
        })
        socket.emit(join_room, { type: channel.order, id: actionId })
        socket.emit(current_sale_promotion, {})
        return () => {
            socket.off(join_room)
            socket.off(channel.order)
            socket.off(current_sale_promotion)
            socket.emit(leave_room, { type: channel.order, id: actionId })
        }
    }, [])

    useEffect(() => {
        if (isCanOrder) {
            socket.off(join_room)
        }
    }, [isCanOrder])

    return {
        socket,
        isCanOrder
    }
}

export default useSocket
