import { yupResolver } from '@hookform/resolvers/yup'
import { CheckIcon } from '@radix-ui/react-icons'
import {
    AlertDialog,
    Button,
    DataList,
    Dialog,
    Flex,
    Select,
    Spinner,
    Text,
    TextArea,
    TextField
} from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ProductApi } from 'src/apis/product.api'
import { UploadApi } from 'src/apis/upload_file.api'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'
import { Category } from 'src/types/product.type'
import { create_product_schema, CreateProductSchema } from 'src/utils/product.schema'
import ProductUploadFile from './ProductUploadFile'

type ProductCreateProps = {
    categories: { [key: string]: Category }
}

const ProductCreate = ({ categories }: ProductCreateProps) => {
    const [openSubmit, setOpenSubmit] = useState<boolean>(false)
    const [files, setFiles] = useState<{ [key: string]: File } | undefined>(undefined)
    const [data, setData] = useState<CreateProductSchema | undefined>(undefined)
    const [imagePrimary, setImagePrimary] = useState<string | undefined>(undefined)

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<CreateProductSchema>({
        resolver: yupResolver(create_product_schema)
    })

    const { mutate: uploadMutiFile, isSuccess: IsUploadFileSuccess } = useMutation({
        mutationFn: UploadApi.updateMultipleFile,
        onSuccess: (result) => {
            createProductMutate({
                ...(data as any),
                productImages: result.data.result,
                imagePrimary: result.data.result[0]
            })
        },
        onError: () => {
            toast.error('Có lỗi trong quá trình upload hình ảnh')
        }
    })
    const { mutate: createProductMutate, isSuccess: isCreateProductSuccess } = useMutation({
        mutationFn: ProductApi.createProduct,
        onSuccess: () => {
            setTimeout(() => {
                setOpenSubmit(false)
            }, 2500)
        },
        onError: () => {
            toast.error('Lỗi tạo mới sản phẩm')
        }
    })

    const onSubmit: SubmitHandler<CreateProductSchema> = (data) => {
        if (!files || Object.keys(files).length < 3) {
            toast.error('Cần ít nhất 3 hình ảnh của sản phẩm')
            return
        }
        setOpenSubmit(true)
        setData(data)
    }

    useEffect(() => {
        if (openSubmit) {
            var formData = new FormData()
            Object.values(files as any).forEach((file) => {
                formData.append('files', file as any)
            })
            uploadMutiFile(formData)
        }
    }, [openSubmit])

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button className='bg-blue text-white'>Tạo mới sản phẩm</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth='600px' className='!rounded-8'>
                <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
                    <AlertDialog.Title>Tạo mới sản phẩm</AlertDialog.Title>
                    <Flex direction={'column'} gapY={'2'}>
                        <Carousel className='w-full'>
                            <CarouselContent>
                                {Array(6)
                                    .fill(0)
                                    .map((_, idx) => (
                                        <div className='basis-1/3 mr-5 last:mr-0 flex-shrink-0'>
                                            <ProductUploadFile setFiles={setFiles} key={idx} id={`file${idx + 1}`} />
                                        </div>
                                    ))}
                            </CarouselContent>
                            <CarouselPrevious type='button' />
                            <CarouselNext type='button' />
                        </Carousel>
                        <Text size={'2'} color='gray'>
                            <Text color='red'>*</Text> Cần có ít nhất 3 hình ảnh sản phẩm
                        </Text>
                    </Flex>
                    <DataList.Root>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Tên sản phẩm</Text>
                                    {errors.name && (
                                        <Text color='red' size={'2'} align={'left'}>
                                            {errors.name.message}
                                        </Text>
                                    )}
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Controller
                                    control={control}
                                    name='name'
                                    render={({ field }) => (
                                        <TextArea
                                            color={errors.name ? 'red' : 'blue'}
                                            {...field}
                                            className='!flex-grow'
                                        />
                                    )}
                                />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Giá trước giảm</Text>
                                    {errors.priceBefore && (
                                        <Text color={errors.priceBefore ? 'red' : 'blue'} size={'2'} align={'left'}>
                                            {errors.priceBefore.message}
                                        </Text>
                                    )}
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Controller
                                    control={control}
                                    name='priceBefore'
                                    render={({ field }) => (
                                        <TextField.Root
                                            {...field}
                                            color={errors.priceBefore ? 'red' : 'blue'}
                                            className='!flex-grow'
                                        />
                                    )}
                                />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Giá sau giảm</Text>
                                    {errors.priceAfter && (
                                        <Text color={errors.priceAfter ? 'red' : 'blue'} size={'2'} align={'left'}>
                                            {errors.priceAfter.message}
                                        </Text>
                                    )}
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Controller
                                    control={control}
                                    name='priceAfter'
                                    render={({ field }) => (
                                        <TextField.Root
                                            color={errors.priceAfter ? 'red' : 'blue'}
                                            {...field}
                                            className='!flex-grow'
                                        />
                                    )}
                                />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Số lượng</Text>
                                    {errors.initQuantity && (
                                        <Text color={errors.initQuantity ? 'red' : 'blue'} size={'2'} align={'left'}>
                                            {errors.initQuantity.message}
                                        </Text>
                                    )}
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Controller
                                    control={control}
                                    name='initQuantity'
                                    render={({ field }) => (
                                        <TextField.Root
                                            {...field}
                                            color={errors.initQuantity ? 'red' : 'blue'}
                                            type='number'
                                            className='!flex-grow'
                                        />
                                    )}
                                />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Trạng thái</Text>
                                    {errors.status && (
                                        <Text color={errors.status ? 'red' : 'blue'} size={'2'} align={'left'}>
                                            {errors.status.message}
                                        </Text>
                                    )}
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Controller
                                    control={control}
                                    name='status'
                                    render={({ field }) => (
                                        <Select.Root onValueChange={field.onChange} {...field}>
                                            <Select.Trigger placeholder='Chọn trạng thái...' />
                                            <Select.Content position='popper' className='!rounded-8'>
                                                <Select.Item value='ACTIVE'>ACTIVE</Select.Item>
                                                <Select.Item value='BLOCK'>BLOCK</Select.Item>
                                            </Select.Content>
                                        </Select.Root>
                                    )}
                                />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Danh mục</Text>
                                    {errors.category && (
                                        <Text color={errors.category ? 'red' : 'blue'} size={'2'} align={'left'}>
                                            {errors.category.message}
                                        </Text>
                                    )}
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Controller
                                    control={control}
                                    name='category'
                                    render={({ field }) => (
                                        <Select.Root onValueChange={field.onChange} {...field}>
                                            <Select.Trigger placeholder='Chọn danh mục...' />
                                            <Select.Content align='start' position='popper' className='!rounded-8'>
                                                {Object.entries(categories).map(([key, value]) => (
                                                    <Select.Item value={key}>{value.name}</Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Root>
                                    )}
                                />
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                    <Flex gap='3' mt='4' justify='end'>
                        <AlertDialog.Cancel>
                            <Button variant='outline' color='red'>
                                Trở về
                            </Button>
                        </AlertDialog.Cancel>
                        <Dialog.Root open={openSubmit}>
                            <Dialog.Trigger>
                                <Button type='submit' className='bg-blue text-white'>
                                    Tạo mới
                                </Button>
                            </Dialog.Trigger>
                            <Dialog.Content maxWidth='500px' className='!rounded-8'>
                                <Dialog.Title>Quá trình tạo sản phẩm đang diễn ra</Dialog.Title>
                                <Dialog.Description size='2' mb='4'>
                                    Đừng thực hiện bất kì điều gì trước khi quá trình hoàn tất!
                                </Dialog.Description>
                                <Flex direction='column' gapY='4'>
                                    <Flex gapX={'5'} align={'center'}>
                                        {IsUploadFileSuccess ? <CheckIcon /> : <Spinner />} Tải hình ảnh lên đám mây
                                    </Flex>
                                    <Flex gapX={'5'} align={'center'}>
                                        {isCreateProductSuccess ? <CheckIcon /> : <Spinner />} Lưu dữ liệu sản phẩm vào
                                        cơ sở dữ liệu
                                    </Flex>
                                </Flex>
                            </Dialog.Content>
                        </Dialog.Root>
                    </Flex>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default ProductCreate
