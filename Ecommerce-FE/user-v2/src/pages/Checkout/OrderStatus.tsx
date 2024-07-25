import { AlertDialog, Button, Flex, Spinner, Text } from '@radix-ui/themes'
import CryptoJS from 'crypto-js'
import * as querystring from 'qs'
import { useContext, useEffect, useState } from 'react'
import { IoCheckmarkDoneSharp } from 'react-icons/io5'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AppContext } from 'src/contexts/AppContext'
import { sortObject } from 'src/utils/utils.ts'

type OrderStatusProps = {
    handleOrder: () => void
}

const OrderStatus = ({ handleOrder }: OrderStatusProps) => {
    const { statusOfOrder, setStatusOfOrder } = useContext(AppContext)
    const [searchParams, _] = useSearchParams()
    const navigate = useNavigate()
    let vnp_Params = Object.fromEntries(searchParams)
    const isOpen = vnp_Params?.['status']
    const [open, setOpen] = useState<boolean>(!!isOpen)

    let secureHash = vnp_Params['vnp_SecureHash']

    delete vnp_Params['vnp_SecureHash']
    delete vnp_Params['vnp_SecureHashType']

    vnp_Params = sortObject(vnp_Params)

    let secretKey = import.meta.env.VITE_VNP_HASHSECRET

    let signData = querystring.stringify(vnp_Params, { encode: false })
    let hmac = CryptoJS.HmacSHA512(signData, secretKey)
    let signed = hmac.toString(CryptoJS.enc.Hex)

    let isSuccess = true
    if (true || secureHash === signed) {
    }

    const handleExit = () => {
        navigate(window.location.pathname, { replace: true })
        setOpen(false)
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success('Thanh toán thành công')
            setTimeout(() => {
                handleOrder()
            }, 800)
        }
    }, [])

    return (
        <AlertDialog.Root open={open} onOpenChange={handleExit}>
            <AlertDialog.Content maxWidth='600px' className='rounded-8'>
                <AlertDialog.Title>Đang xử lý đơn hàng</AlertDialog.Title>
                <AlertDialog.Description>
                    Trong quá trình xử lý đơn hàng, bạn có thể thoát khỏi màn hình này.
                </AlertDialog.Description>
                <div className='py-5 space-y-4'>
                    <Flex align={'center'} gapX={'4'}>
                        <IoCheckmarkDoneSharp />
                        <Text>Thanh toán thành công</Text>
                    </Flex>
                    {!statusOfOrder ? (
                        <Flex align={'center'} gapX={'4'}>
                            <Spinner />
                            <Text>Đơn hàng của bạn đang được xử lý</Text>
                        </Flex>
                    ) : statusOfOrder?.action ? (
                        <Flex align={'center'} gapX={'4'}>
                            <IoCheckmarkDoneSharp />
                            <Text>Đặt hàng thành công</Text>
                        </Flex>
                    ) : (
                        <Flex align={'center'} gapX={'4'}>
                            <IoCheckmarkDoneSharp />
                            <Text>Đặt hàng thất bại</Text>
                        </Flex>
                    )}
                </div>
                <Flex justify={'end'} align={'center'}>
                    <AlertDialog.Cancel>
                        <Button onClick={handleExit}>Trở về</Button>
                    </AlertDialog.Cancel>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default OrderStatus
