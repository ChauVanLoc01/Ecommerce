import { message } from 'antd'

function useMessage() {
    const [messageApi, contextHolder] = message.useMessage()
    return [messageApi, contextHolder]
}

export default useMessage
