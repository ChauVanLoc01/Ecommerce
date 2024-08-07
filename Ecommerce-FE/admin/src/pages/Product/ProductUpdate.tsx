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
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { ProductApi } from 'src/apis/product.api'
import { UploadApi } from 'src/apis/upload_file.api'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'
import { Category, Product, ProductAnalyticResponse, ProductQueryAndPagination } from 'src/types/product.type'
import { update_product_schema, UpdateProductSchema } from 'src/utils/product.schema'
import ProductUploadFile from './ProductUploadFile'
import { formatCurrencyInput, formatQuantityInput } from 'src/utils/utils'

type ProductUpdateProps = {
    categories: { [key: string]: Category }
    analyticsRefetch: (
        options?: RefetchOptions
    ) => Promise<QueryObserverResult<AxiosResponse<ProductAnalyticResponse, any>, Error>>
    productListRefetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
            {
                data: Product[]
                query: Omit<ProductQueryAndPagination, 'page'> & {
                    page: number
                    page_size: number
                }
            },
            Error
        >
    >
    open: boolean
    setOpenCreate: React.Dispatch<boolean>
    selectedProduct: Product
}

const ProductUpdate = ({
    categories,
    analyticsRefetch,
    productListRefetch,
    selectedProduct,
    open,
    setOpenCreate
}: ProductUpdateProps) => {
    const [openSubmit, setOpenSubmit] = useState<boolean>(false)
    const [files, setFiles] = useState<{ [key: string]: File } | undefined>(undefined)
    const [data, setData] = useState<Product | undefined>(undefined)
    const [imagePrimary, setImagePrimary] = useState<string | undefined>(undefined)
    const [state, setstate] = useState<{ uploadFile: boolean; createProduct: boolean }>({
        createProduct: true,
        uploadFile: true
    })

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<UpdateProductSchema>({
        resolver: yupResolver(update_product_schema),
        defaultValues: selectedProduct
    })

    const { mutate: uploadMutiFile } = useMutation({
        mutationFn: UploadApi.updateMultipleFile,
        onSuccess: () => {
            updateProductMutate({
                productId: selectedProduct.id,
                body: {
                    category: data?.category,
                    description: data?.description,
                    initQuantity: data?.initQuantity,
                    name: data?.name,
                    priceAfter: data?.priceAfter,
                    priceBefore: data?.priceBefore || 0,
                    status: data?.status
                }
            })
            setstate({ uploadFile: false, createProduct: true })
        },
        onError: () => {
            toast.error('Có lỗi trong quá trình upload hình ảnh')
        }
    })

    const { mutate: updateProductMutate } = useMutation({
        mutationFn: ProductApi.updateProduct,
        onSuccess: async () => {
            await Promise.all([
                setstate({ uploadFile: false, createProduct: false }),
                analyticsRefetch(),
                productListRefetch(),
                setFiles(undefined),
                setTimeout(() => {
                    toast.success('Cập nhật sản phẩm thành công')
                    setOpenSubmit(false)
                }, 2000),
                setTimeout(() => {
                    setOpenCreate(false)
                    setstate({ uploadFile: true, createProduct: true })
                }, 2300),
                reset()
            ])
        },
        onError: () => {
            toast.error('Cập nhật sản phẩm thất bại')
            setOpenSubmit(false)
        }
    })

    const onSubmit: SubmitHandler<UpdateProductSchema> = (data) => {
        if (!files || Object.keys(files).length < 1) {
            toast.error('Cần ít nhất 1 hình ảnh của sản phẩm')
            return
        }
        setOpenSubmit(true)
        setData(data as any)
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
        <AlertDialog.Root open={open} onOpenChange={setOpenCreate}>
            <AlertDialog.Content maxWidth='600px' className='!rounded-8'>
                <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
                    <AlertDialog.Title>Cập nhật sản phẩm</AlertDialog.Title>
                    <Flex direction={'column'} gapY={'2'}>
                        <Carousel className='w-full'>
                            <CarouselContent>
                                {Array(10)
                                    .fill(0)
                                    .map((_, idx) => (
                                        <div key={idx} className='basis-1/3 mr-5 last:mr-0 flex-shrink-0'>
                                            <ProductUploadFile
                                                setFiles={setFiles}
                                                key={idx}
                                                id={`file${idx + 1}`}
                                                imagePrimary={imagePrimary}
                                                setImagePrimary={setImagePrimary}
                                                defaultUrls={[selectedProduct.image]}
                                            />
                                        </div>
                                    ))}
                            </CarouselContent>
                            <CarouselPrevious type='button' />
                            <CarouselNext type='button' />
                        </Carousel>
                        <Text size={'2'} color='gray'>
                            <Text color='red'>*</Text> Cần có ít nhất 3 hình ảnh sản phẩm (
                            <Text color={files && Object.keys(files).length > 2 ? 'blue' : 'red'}>
                                {files ? Object.keys(files).length : 0}
                            </Text>
                            /10)
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
                                            value={formatCurrencyInput(field?.value || 0)}
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
                                            value={formatCurrencyInput(field?.value || 0)}
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
                                            value={formatQuantityInput(field?.value || 0)}
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
                                    Cập nhật
                                </Button>
                            </Dialog.Trigger>
                            <Dialog.Content maxWidth='500px' className='!rounded-8'>
                                <Dialog.Title>Quá trình tạo sản phẩm đang diễn ra</Dialog.Title>
                                <Dialog.Description size='2' mb='4'>
                                    Đừng thực hiện bất kì điều gì trước khi quá trình hoàn tất!
                                </Dialog.Description>
                                <Flex direction='column' gapY='4'>
                                    <Flex gapX={'5'} align={'center'}>
                                        {state.uploadFile ? <Spinner /> : <CheckIcon />} Tải hình ảnh lên đám mây
                                    </Flex>
                                    <Flex gapX={'5'} align={'center'}>
                                        {state.createProduct ? <Spinner /> : <CheckIcon />} Lưu dữ liệu sản phẩm vào cơ
                                        sở dữ liệu
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

export default ProductUpdate
