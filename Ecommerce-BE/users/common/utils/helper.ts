import { room_obj } from 'common/constants/socket.constant'

export const hash = (type: keyof typeof room_obj, id: string) => `${type}::${id}`
