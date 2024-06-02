import { Button, Flex, Text } from '@radix-ui/themes'
import { isRouteErrorResponse, Navigate, useLocation, useRouteError } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import { toast } from 'sonner'
import Header from 'src/layouts/MainLayout/Header'

const Error = () => {
    const error = useRouteError()
    const location = useLocation()

    if (isRouteErrorResponse(error)) {
        switch (error.status) {
            case 401:
                return <Navigate to={'/login'} state={{ from: location.pathname }} replace />
            case 400:
                toast.error('Dữ liệu nạp vào api không đúng yêu cầu')
                break
            case 404:
                toast.error('Url không hợp lệ')
                break
            default:
                toast.error('Lỗi hệ thống')
                break
        }
    }

    return (
        <div className='bg-[#F8F9FA] min-h-screen h-screen  select-none'>
            <SimpleBar style={{ maxHeight: '100vh', height: '100vh' }}>
                <div className='mx-auto w-full max-w-screen-xl h-screen'>
                    <Header />
                    <Flex align={'center'} direction={'column'} gapY={'4'}>
                        <Text weight={'bold'} size={'5'}>
                            Đã có lỗi xảy ra
                        </Text>
                        <img
                            src='https://cdn-icons-png.flaticon.com/512/2797/2797388.png'
                            alt='error-bg'
                            className='w-28 h-28'
                        />
                        <Button>Trờ về trang chủ</Button>
                    </Flex>
                </div>
            </SimpleBar>
        </div>
    )
}

export default Error
