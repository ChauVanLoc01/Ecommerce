import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { profileFetching } from 'src/apis/profile'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { Checkbox } from 'src/components/Shadcn/checkbox'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from 'src/components/Shadcn/dialog'
import { Textarea } from 'src/components/Shadcn/textarea'
import AddressItem from 'src/pages/Checkout/Step2/AddressItem'
import { DeliveryBody } from 'src/types/delivery.type'
import { delivery_schema, DeliverySchemaType } from 'src/utils/delivery.schema'
import LayoutProfile from '../LayoutProfile'

const Address = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [primary, setPrimary] = useState<boolean>(false)
    const deliveries = useQuery({
        queryKey: ['delivery'],
        queryFn: profileFetching.getDeliveries,
        staleTime: Infinity,
        gcTime: Infinity,
        enabled: false
    })
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

    const createDeliveryQuery = useMutation({
        mutationFn: (body: DeliveryBody) => profileFetching.createDelivery(body),
        onSuccess: () => {
            toast.info('Tạo thành công thông tin vận chuyển')
            reset()
            deliveries.refetch()
            setOpen(false)
        },
        onError: () => {
            toast.error('Không thể tạo thông tin vận chuyển')
        }
    })

    const updateDelivery = useMutation({
        mutationFn: (body: Partial<DeliveryBody & { id: string }>) => profileFetching.updateDelivery(body),
        onSuccess: () => {
            toast.info('Cập nhật thành công')
            deliveries.refetch()
        }
    })

    const deleteDelivery = useMutation({
        mutationFn: (deliveryId: string) => profileFetching.deleteDelivery(deliveryId),
        onSuccess: () => {
            toast.success('Xóa thông tin vận chuyển thành công')
            deliveries.refetch()
        },
        onError: () => {
            toast.error('Đã có lỗi xảy ra')
        }
    })

    const handleResetForm = () => reset()

    const onSubmit: SubmitHandler<DeliverySchemaType> = (data) =>
        createDeliveryQuery.mutate({ ...data, isPrimary: primary })

    const handleDeleteAddress = (addressId: string) => () => deleteDelivery.mutate(addressId)

    const handleSetDefault = (addressId: string) => () => updateDelivery.mutate({ id: addressId, isPrimary: true })

    return (
        <LayoutProfile title='Địa chỉ nhận hàng'>
            <div className='text-right'>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button text='Thêm địa chỉ' />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className='space-y-6'>
                            <DialogTitle>Thêm mới địa chỉ nhận hàng</DialogTitle>
                            <DialogDescription>
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
                                                        className={classNames('text-red-500', {
                                                            hidden: !address?.message
                                                        })}
                                                    >
                                                        {address?.message}
                                                    </div>
                                                    <Textarea {...field} />
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
                                            <Checkbox
                                                id='terms'
                                                checked={primary}
                                                onCheckedChange={setPrimary as any}
                                            />
                                            <label
                                                htmlFor='terms'
                                                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                                            >
                                                Đặt làm mặc định
                                            </label>
                                        </div>
                                    </div>
                                    <div className='flex justify-end space-x-3'>
                                        <Button
                                            text='Hủy'
                                            onClick={handleResetForm}
                                            className='bg-red-500 hover:bg-red-600'
                                        />
                                        <Button text='Thêm' type='submit' />
                                    </div>
                                </form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            <div className='grid grid-cols-3 gap-4 mt-4'>
                {deliveries.data?.data.result.map((delivery) => (
                    <AddressItem
                        handleDeleteAddress={handleDeleteAddress}
                        handleSetDefault={handleSetDefault}
                        delivery={delivery}
                        isDropdown
                    />
                ))}
            </div>
        </LayoutProfile>
    )
}

export default Address
