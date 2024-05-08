import { AlertDialog, Button, Flex, Text, TextField } from '@radix-ui/themes'

const EmployeeHeader = () => {
    return (
        <Flex gapX={'5'} align={'center'}>
            <Text weight='medium' size={'4'}>
                Tổng 1000 nhân viên
            </Text>
            <AlertDialog.Root>
                <AlertDialog.Trigger>
                    <Button className='bg-blue text-white'>Tạo nhân viên</Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth='550px' className='!rounded-8'>
                    <AlertDialog.Title>Tạo mới nhân viên</AlertDialog.Title>
                    <Flex gapY={'3'} direction={'column'}>
                        <Flex justify={'between'} gapX={'5'}>
                            <div className='basis-1/2'>
                                <Text>Họ tên</Text>
                                <TextField.Root />
                            </div>
                            <div className='basis-1/2'>
                                <Text>Email</Text>
                                <TextField.Root />
                            </div>
                        </Flex>
                        <Flex justify={'between'} gapX={'5'}>
                            <div className='basis-1/2'>
                                <Text>Tên tài khoản</Text>
                                <TextField.Root />
                            </div>
                            <div className='basis-1/2'>
                                <Text>Mật khẩu</Text>
                                <TextField.Root />
                            </div>
                        </Flex>
                    </Flex>
                    <Flex gap='3' mt='4' justify='end'>
                        <AlertDialog.Cancel>
                            <Button variant='outline' color='red'>
                                Trở về
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button className='bg-blue text-white'>Tạo mới</Button>
                        </AlertDialog.Action>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </Flex>
    )
}

export default EmployeeHeader
