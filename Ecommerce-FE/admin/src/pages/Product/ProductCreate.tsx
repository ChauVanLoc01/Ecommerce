import { yupResolver } from '@hookform/resolvers/yup'
import { AlertDialog, Button, DataList, Flex, Select, Text, TextArea, TextField } from '@radix-ui/themes'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'
import { Category } from 'src/types/product.type'
import { create_product_schema, CreateProductSchema } from 'src/utils/product.schema'
import ProductUploadFile from './ProductUploadFile'

type ProductCreateProps = {
    categories: { [key: string]: Category }
}

const ProductCreate = ({ categories }: ProductCreateProps) => {
    const [files, setFiles] = useState<{ [key: string]: File } | undefined>(undefined)

    const { handleSubmit, control } = useForm<CreateProductSchema>({
        resolver: yupResolver(create_product_schema)
    })

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button className='bg-blue text-white'>Tạo mới sản phẩm</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth='600px' className='!rounded-8'>
                <form className='space-y-5'>
                    <AlertDialog.Title>Tạo mới sản phẩm</AlertDialog.Title>
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
                    <DataList.Root>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Text>Tên sản phẩm</Text>
                            </DataList.Label>
                            <DataList.Value>
                                <TextArea className='!flex-grow' />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Text>Giá trước giảm</Text>
                            </DataList.Label>
                            <DataList.Value>
                                <TextField.Root className='!flex-grow' />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Text>Giá sau giảm</Text>
                            </DataList.Label>
                            <DataList.Value>
                                <TextField.Root className='!flex-grow' />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Text>Số lượng</Text>
                            </DataList.Label>
                            <DataList.Value>
                                <TextField.Root className='!flex-grow' />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Text>Trạng thái</Text>
                            </DataList.Label>
                            <DataList.Value>
                                <Select.Root defaultValue='ACTIVE'>
                                    <Select.Trigger />
                                    <Select.Content position='popper' className='!rounded-8'>
                                        <Select.Item value='ACTIVE'>ACTIVE</Select.Item>
                                        <Select.Item value='BLOCK'>BLOCK</Select.Item>
                                    </Select.Content>
                                </Select.Root>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Text>Danh mục</Text>
                            </DataList.Label>
                            <DataList.Value>
                                <Select.Root>
                                    <Select.Trigger placeholder='Chọn danh mục...' />
                                    <Select.Content align='start' position='popper' className='!rounded-8'>
                                        {Object.entries(categories).map(([key, value]) => (
                                            <Select.Item value={key}>{value.name}</Select.Item>
                                        ))}
                                    </Select.Content>
                                </Select.Root>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
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
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default ProductCreate
