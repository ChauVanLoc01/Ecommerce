import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { socket_connect, socket_disconnection } from 'src/constants/event'

export const socket = io(import.meta.env.VITE_SOCKET_ENPOINT, {
    autoConnect: false
})

const useConnection = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false)

    const onConnection = () => setIsConnected(true)

    const onDisconnection = () => setIsConnected(false)

    const forceDisconnection = () => {
        socket.off(socket_disconnection)
    }

    useEffect(() => {
        socket.on(socket_connect, onConnection)

        return () => {
            socket.off(socket_disconnection, onDisconnection)
        }
    }, [])

    return {
        isConnected,
        setIsConnected
    }
}

export default useConnection
