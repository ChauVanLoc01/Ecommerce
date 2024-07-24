import { CheckIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Flex, Spinner, Text } from '@radix-ui/themes'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const OrderStatus = () => {
    const [searchParams, _] = useSearchParams()
    const query = Object.fromEntries(searchParams)
    const isOpen = query?.['status']
    const [open, setOpen] = useState<boolean>(!!isOpen)

    // let actionId = req?.['vnp_ActionId']
    //     let vnp_Params = req.query

    //     console.log('actionId', actionId)

    //     let secureHash = vnp_Params['vnp_SecureHash']

    //     delete vnp_Params['vnp_SecureHash']
    //     delete vnp_Params['vnp_SecureHashType']

    //     vnp_Params = this.sortObject(vnp_Params)

    //     let secretKey = this.configService.get('app.vnp_HashSecret')

    //     let signData = querystring.stringify(vnp_Params, { encode: false })
    //     let crypto = require('crypto')
    //     let hmac = crypto.createHmac('sha512', secretKey)
    //     let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

    //     if (secureHash === signed) {
    //         this.socketClient.emit(statusOfTransaction, {
    //             id: actionId,
    //             action: true,
    //             msg: 'Thanh toán thành công'
    //         })
    //     } else {
    //         this.socketClient.emit(statusOfTransaction, {
    //             id: actionId,
    //             action: false,
    //             msg: 'Thanh toán thất bại'
    //         })
    //     }

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Content maxWidth='600px' className='rounded-8'>
                <AlertDialog.Title>Đang xử lý đơn hàng</AlertDialog.Title>
                <AlertDialog.Description>
                    Trong quá trình xử lý đơn hàng, bạn có thể thoát khỏi màn hình này.
                </AlertDialog.Description>
                <div className='py-5 space-y-4'>
                    <Flex align={'center'} gapX={'4'}>
                        <CheckIcon />
                        <Text>Thanh toán thành công</Text>
                    </Flex>
                    <Flex align={'center'} gapX={'4'}>
                        <Spinner />
                        <Text>Đơn hàng của bạn đang được xử lý</Text>
                    </Flex>
                </div>
                <Flex justify={'end'} align={'center'}>
                    <AlertDialog.Cancel>
                        <Button>Trở về</Button>
                    </AlertDialog.Cancel>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default OrderStatus
