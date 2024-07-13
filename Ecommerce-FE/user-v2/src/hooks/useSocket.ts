import { useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'
import { channel, join_room, leave_room } from 'src/constants/event'
import { AppContext } from 'src/contexts/AppContext'
import { SocketReturn } from 'src/types/socket.type'

type UseSocketProps = {
    actionId: string
}

const useSocket = ({ actionId }: UseSocketProps) => {
    const { toastIdRef } = useContext(AppContext)
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
                toast.success(res.msg)
            } else {
                toast.error(res.msg)
            }
        })
        socket.emit(join_room, { type: channel.order, id: actionId })
        return () => {
            socket.off(join_room)
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
