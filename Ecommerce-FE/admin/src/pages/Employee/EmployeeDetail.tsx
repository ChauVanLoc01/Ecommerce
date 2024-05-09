import { AlertDialog, Button, DataList, Flex, Text } from '@radix-ui/themes'
import { format } from 'date-fns'
import { EmployeeList } from 'src/types/employee.type'

type EmployeeDetailProps = {
    data: EmployeeList
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const EmployeeDetail = ({ open, setOpen, data }: EmployeeDetailProps) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Content maxWidth='450px' className='!rounded-8'>
                <AlertDialog.Title>Thông tin chi tiết nhân viên</AlertDialog.Title>
                <DataList.Root>
                    <DataList.Item align='end'>
                        <DataList.Label minWidth='130px'>Họ tên</DataList.Label>
                        <DataList.Value>
                            <Text>{data.User_Account_userIdToUser.full_name}</Text>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item align='end'>
                        <DataList.Label minWidth='130px'>Email</DataList.Label>
                        <DataList.Value>
                            <Text>{data.User_Account_userIdToUser.email}</Text>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item align='end'>
                        <DataList.Label minWidth='130px'>Tài khoản</DataList.Label>
                        <DataList.Value>
                            <Text>{data.username}</Text>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item align='end'>
                        <DataList.Label minWidth='130px'>Thời gian tạo</DataList.Label>
                        <DataList.Value>
                            <span>{format(data.createdAt, 'hh:mm dd-MM-yyyy')}</span>
                        </DataList.Value>
                    </DataList.Item>
                </DataList.Root>
                <Flex gap='3' mt='4' justify='end'>
                    <AlertDialog.Cancel>
                        <Button variant='outline' color='blue'>
                            Trở về
                        </Button>
                    </AlertDialog.Cancel>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default EmployeeDetail
