import { AlertDialog, Badge, Button, DataList, Flex, Text, TextArea, TextField } from '@radix-ui/themes'
import React from 'react'
import { useLoaderData } from 'react-router-dom'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'
import { ProductStatus } from 'src/constants/product.status'
import { Category, Product } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'

export type ProductDetailProps = {
    open: boolean
    setOpenCreate: React.Dispatch<boolean>
    selectedProduct: Product
}

const ProductDetail = ({ open, setOpenCreate, selectedProduct }: ProductDetailProps) => {
    const [_, categories] = useLoaderData() as [any, { [key: string]: Category }]

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpenCreate}>
            <AlertDialog.Content maxWidth='600px' className='!rounded-8'>
                <form className='space-y-5'>
                    <AlertDialog.Title>Chi tiết sản phẩm</AlertDialog.Title>
                    <Flex direction={'column'} gapY={'2'}>
                        <Carousel className='w-full'>
                            <CarouselContent>
                                {Array(1)
                                    .fill(0)
                                    .map((_, idx) => (
                                        <div key={idx} className='basis-1/3 mr-5 last:mr-0 flex-shrink-0'>
                                            <img
                                                key={`img-${selectedProduct.id}-${idx}`}
                                                src={selectedProduct.image}
                                                alt='image'
                                                loading='lazy'
                                            />
                                        </div>
                                    ))}
                            </CarouselContent>
                            <CarouselPrevious type='button' />
                            <CarouselNext type='button' />
                        </Carousel>
                    </Flex>
                    <DataList.Root>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Tên sản phẩm</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Text>{selectedProduct.name}</Text>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Giá trước giảm</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <TextField.Root
                                    disabled
                                    className='!flex-grow'
                                    value={
                                        selectedProduct.priceBefore ? convertCurrentcy(selectedProduct.priceBefore) : ''
                                    }
                                />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Giá sau giảm</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <TextField.Root
                                    className='!flex-grow'
                                    disabled
                                    value={convertCurrentcy(selectedProduct.priceAfter)}
                                />
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Số lượng</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Flex className='space-x-3'>
                                    <Badge size={'3'} color='blue'>
                                        Tổng {convertCurrentcy(selectedProduct.currentQuantity, false)}
                                    </Badge>
                                    <Badge size={'3'} color='red'>
                                        Đã bán {convertCurrentcy(selectedProduct.sold, false)}
                                    </Badge>
                                </Flex>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Trạng thái</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Badge size={'3'} color={ProductStatus[selectedProduct.status]}>
                                    {selectedProduct.status}
                                </Badge>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='start'>
                            <DataList.Label minWidth='180px'>
                                <Flex direction={'column'}>
                                    <Text>Danh mục</Text>
                                </Flex>
                            </DataList.Label>
                            <DataList.Value>
                                <Badge size={'3'} color='gray'>
                                    {categories[selectedProduct.category].name}
                                </Badge>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                    <Flex gap='3' mt='4' justify='end'>
                        <AlertDialog.Cancel>
                            <Button variant='outline' color='red'>
                                Trở về
                            </Button>
                        </AlertDialog.Cancel>
                    </Flex>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default ProductDetail
