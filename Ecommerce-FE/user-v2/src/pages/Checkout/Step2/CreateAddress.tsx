import { yupResolver } from '@hookform/resolvers/yup'
import { AlertDialog, Button, Checkbox, TextArea } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { profileFetching } from 'src/apis/profile'
import Input from 'src/components/Input'
import { Delivery, DeliveryBody } from 'src/types/delivery.type'
import { Return } from 'src/types/return.type'
import { delivery_schema, DeliverySchemaType } from 'src/utils/delivery.schema'
import { cn } from 'src/utils/utils.ts'

type CreateAddressProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    refetchDelivery: (
        options?: RefetchOptions
    ) => Promise<QueryObserverResult<AxiosResponse<Return<Delivery[]>, any>, Error>>
}

const CreateAddress = ({ open, setOpen, refetchDelivery }: CreateAddressProps) => {
    const {
        register,
        formState: {
            errors: { address, full_name, phone }
        },
        control,
        handleSubmit,
        reset
    } = useForm<DeliverySchemaType>({
        resolver: yupResolver(delivery_schema)
    })

    const onSubmit: SubmitHandler<DeliverySchemaType> = (data) =>
        createDeliveryQuery.mutate({ ...data, isPrimary: false })

    const createDeliveryQuery = useMutation({
        mutationFn: (body: DeliveryBody) => profileFetching.createDelivery(body),
        onSuccess: () => {
            toast.info('Tạo thành công thông tin vận chuyển')
            reset()
            refetchDelivery()
            setOpen(false)
        },
        onError: () => {
            toast.error('Không thể tạo thông tin vận chuyển')
        }
    })

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger>
                <Button variant='soft'>Thêm mới địa chỉ</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content className='!rounded-8'>
                <AlertDialog.Title>Thêm mới địa chỉ nhận hàng</AlertDialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
                    <div className='grid grid-cols-5'>
                        <h3 className='col-span-2'>Tên người nhận:</h3>
                        <Input
                            rootClassName='col-start-3 col-span-3'
                            register={register('full_name')}
                            error={full_name?.message}
                        />
                    </div>
                    <div className='grid grid-cols-5'>
                        <h3 className='col-span-2'>Địa chỉ:</h3>
                        <Controller
                            name='address'
                            control={control}
                            render={({ field }) => (
                                <div className='col-start-3 col-span-3'>
                                    <div
                                        className={cn('text-red-500', {
                                            hidden: !address?.message
                                        })}
                                    >
                                        {address?.message}
                                    </div>
                                    <TextArea {...field} />
                                </div>
                            )}
                        />
                    </div>
                    <div className='grid grid-cols-5'>
                        <h3 className='col-span-2'>Số điện thoại:</h3>
                        <Input
                            rootClassName='col-start-3 col-span-3'
                            register={register('phone')}
                            error={phone?.message}
                        />
                    </div>
                    <div className='grid grid-cols-5'>
                        <div className='col-start-3 col-span-3 flex items-center space-x-2'>
                            <Checkbox id='terms' />
                            <label
                                htmlFor='terms'
                                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                                Đặt làm mặc định
                            </label>
                        </div>
                    </div>
                    <div className='flex justify-end space-x-3'>
                        <AlertDialog.Cancel>
                            <Button type='button' size={'3'} variant='outline' color='red'>
                                Hủy
                            </Button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action>
                            <Button type='submit' size={'3'}>
                                Thêm mới
                            </Button>
                        </AlertDialog.Action>
                    </div>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default CreateAddress
