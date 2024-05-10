import { yupResolver } from '@hookform/resolvers/yup'
import { AlertDialog, Button, Flex, Kbd, Spinner, Text, TextField } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { EmployeeApi } from 'src/apis/employee.api'
import { EmployeeList, EmployeeQuery } from 'src/types/employee.type'
import { CreateEmployee, register_employee_schema } from 'src/utils/employee.schema'

type EmployeeHeaderProps = {
    analyticsData: { all: number; actives: number; blocks: number }
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

const EmployeeHeader = ({ refetch, analyticsData: { actives, all, blocks } }: EmployeeHeaderProps) => {
    const [openCreateEmployee, setOpenCreateEmployee] = useState<boolean>(false)

    const { control, handleSubmit, setError } = useForm<CreateEmployee>({
        resolver: yupResolver(register_employee_schema)
    })

    const { mutate, isPending } = useMutation({
        mutationFn: EmployeeApi.createEmployee,
        onSuccess: async () => {
            refetch()
            toast.success('Tạo nhân viên thành công')
            setOpenCreateEmployee(false)
        },
        onError: (err) => {
            if (
                isAxiosError(err) &&
                err.response?.status === 400 &&
                err.response.data['message'] === 'Tài khoản đã tồn tại'
            ) {
                toast.error('Tài khoản đã tồn tại')
                setError('username', { message: 'Đã tồn tại' })
            }
        }
    })

    const onSubmit: SubmitHandler<CreateEmployee> = (data) => mutate(data)

    return (
        <Flex gapX={'5'} align={'center'}>
            <Text weight='medium' size={'4'}>
                Tổng: <Kbd>{all}</Kbd> nhân viên
            </Text>
            <Text weight='medium' size={'4'}>
                Đang hoạt động: <Kbd>{actives}</Kbd> nhân viên
            </Text>
            <Text weight='medium' size={'4'}>
                Đã khóa: <Kbd>{blocks}</Kbd> nhân viên
            </Text>
            <AlertDialog.Root open={openCreateEmployee} onOpenChange={setOpenCreateEmployee}>
                <AlertDialog.Trigger>
                    <Button className='bg-blue text-white'>Tạo nhân viên</Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth='550px' className='!rounded-8'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AlertDialog.Title>Tạo mới nhân viên</AlertDialog.Title>
                        <Flex gapY={'3'} direction={'column'}>
                            <Flex justify={'between'} gapX={'5'}>
                                <div className='basis-1/2'>
                                    <Controller
                                        control={control}
                                        name='full_name'
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Flex justify={'between'} align={'center'}>
                                                    <Text>Họ tên</Text>
                                                    {error && (
                                                        <Text size={'2'} color='red'>
                                                            {error.message}
                                                        </Text>
                                                    )}
                                                </Flex>
                                                <TextField.Root {...field} />
                                            </>
                                        )}
                                    />
                                </div>
                                <div className='basis-1/2'>
                                    <Controller
                                        control={control}
                                        name='email'
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Flex justify={'between'} align={'center'}>
                                                    <Text>Email</Text>
                                                    {error && (
                                                        <Text size={'2'} color='red'>
                                                            {error.message}
                                                        </Text>
                                                    )}
                                                </Flex>
                                                <TextField.Root {...field} />
                                            </>
                                        )}
                                    />
                                </div>
                            </Flex>
                            <Flex justify={'between'} gapX={'5'}>
                                <div className='basis-1/2'>
                                    <Controller
                                        control={control}
                                        name='username'
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Flex justify={'between'} align={'center'}>
                                                    <Text>Tài khoản</Text>
                                                    {error && (
                                                        <Text size={'2'} color='red'>
                                                            {error.message}
                                                        </Text>
                                                    )}
                                                </Flex>
                                                <TextField.Root {...field} />
                                            </>
                                        )}
                                    />
                                </div>
                                <div className='basis-1/2'>
                                    <Controller
                                        control={control}
                                        name='password'
                                        render={({ field, fieldState: { error } }) => (
                                            <>
                                                <Flex justify={'between'} align={'center'}>
                                                    <Text>Mật khẩu</Text>
                                                    {error && (
                                                        <Text size={'2'} color='red'>
                                                            {error.message}
                                                        </Text>
                                                    )}
                                                </Flex>
                                                <TextField.Root {...field} />
                                            </>
                                        )}
                                    />
                                </div>
                            </Flex>
                        </Flex>
                        <Flex gap='3' mt='4' justify='end'>
                            <AlertDialog.Cancel>
                                <Button variant='outline' color='red' type='button'>
                                    Trở về
                                </Button>
                            </AlertDialog.Cancel>
                            <Button className='bg-blue text-white'>{isPending && <Spinner />} Tạo mới</Button>
                        </Flex>
                    </form>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </Flex>
    )
}

export default EmployeeHeader
