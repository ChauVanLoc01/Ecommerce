import { yupResolver } from '@hookform/resolvers/yup'
import { AlertDialog, Button, DataList, Flex, Spinner, Text } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { EmployeeApi } from 'src/apis/employee.api'
import InputPassword from 'src/components/InputPassword'
import { EmployeeList, EmployeeQuery } from 'src/types/employee.type'
import { edit_employee_schema, EditEmployee } from 'src/utils/employee.schema'

type EmployeeEditProps = {
    data: EmployeeList
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    refetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
            {
                data: EmployeeList[]
                query: Omit<EmployeeQuery, 'page'> & {
                    page_size: number
                    page: number
                }
            },
            Error
        >
    >
}

const EmployeeEdit = ({ open, setOpen, data, refetch }: EmployeeEditProps) => {
    const { control, handleSubmit } = useForm<EditEmployee>({
        resolver: yupResolver(edit_employee_schema)
    })

    const { mutate, isPending } = useMutation({
        mutationFn: EmployeeApi.resetPassword,
        onSuccess: () => {
            setOpen(false)
            refetch()
            setTimeout(() => {
                toast.success('Tạo lại mật khẩu cho nhân viên thành công')
            }, 500)
        },
        onError: () => {
            toast.success('Lỗi! Tạo lại mật khẩu không thành công')
        }
    })

    const onSubmit: SubmitHandler<EditEmployee> = (dataForm) =>
        mutate({ employeeId: data.userId, password: dataForm.password, username: data.username })

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Content maxWidth='450px' className='!rounded-8'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <AlertDialog.Title>Chỉnh sửa thông tin nhân viên</AlertDialog.Title>
                    <DataList.Root className='space-y-2'>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='130px'>Họ tên</DataList.Label>
                            <DataList.Value>
                                <Text>{data.User_Account_userIdToUser.full_name}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
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
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='130px'>Mật khẩu</DataList.Label>
                            <DataList.Value>
                                <Controller
                                    control={control}
                                    name='password'
                                    render={({ field, fieldState: { error } }) => (
                                        <Flex direction={'column'}>
                                            {error && (
                                                <Text color='red' size={'3'}>
                                                    {error.message}
                                                </Text>
                                            )}
                                            <InputPassword field={field} />
                                        </Flex>
                                    )}
                                />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='end'>
                            <DataList.Label minWidth='130px'>Thời gian tạo</DataList.Label>
                            <DataList.Value>
                                <span>{format(data.createdAt, 'hh:mm dd-MM-yyyy')}</span>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='end'>
                            <DataList.Label minWidth='130px'>Cập nhật</DataList.Label>
                            <DataList.Value>
                                <span>{data.updatedAt ? format(data.updatedAt, 'hh:mm dd-MM-yyyy') : '_'}</span>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                    <Flex gap='3' mt='4' justify='end'>
                        <AlertDialog.Cancel>
                            <Button variant='outline' color='red' type='button'>
                                Hủy
                            </Button>
                        </AlertDialog.Cancel>
                        <Button type='submit' className='bg-blue text-white'>
                            {isPending && <Spinner />}
                            Xác nhận
                        </Button>
                    </Flex>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default EmployeeEdit
