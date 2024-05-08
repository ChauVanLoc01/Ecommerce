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
                <AlertDialog.Content maxWidth='450px' className='!rounded-8'>
                    <AlertDialog.Title>Tạo mới nhân viên</AlertDialog.Title>
                    <Text>Tài khoản</Text>
                    <Flex>
                        <div>
                            <Text>Tên tài khoản</Text>
                            <TextField.Root />
                        </div>
                        <div>
                            <Text>Mật khẩu</Text>
                            <TextField.Root />
                        </div>
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
