import { yupResolver } from '@hookform/resolvers/yup'
import { AlertDialog, Button, DataList, Em, Flex, Select, Text, TextArea, TextField } from '@radix-ui/themes'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'
import { Category } from 'src/types/product.type'
import { create_product_schema, CreateProductSchema } from 'src/utils/product.schema'
import ProductUploadFile from './ProductUploadFile'

type ProductCreateProps = {
    categories: { [key: string]: Category }
}

const ProductCreate = ({ categories }: ProductCreateProps) => {
    const [files, setFiles] = useState<{ [key: string]: File } | undefined>(undefined)

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<CreateProductSchema>({
        resolver: yupResolver(create_product_schema)
    })

    const onSubmit: SubmitHandler<CreateProductSchema> = (data) => {
        if (!files || Object.keys(files).length < 3) {
            toast.error('Cần ít nhất 3 hình ảnh của sản phẩm')
            return
        }
    }

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
                        <Button type='submit' className='bg-blue text-white'>
                            Tạo mới
                        </Button>
                    </Flex>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default ProductCreate
