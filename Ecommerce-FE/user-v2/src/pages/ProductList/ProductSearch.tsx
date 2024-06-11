import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Button, Dialog, Flex, Grid, Spinner, Text, TextField } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { IoSearchOutline } from 'react-icons/io5'
import SimpleBar from 'simplebar-react'
import { productFetching } from 'src/apis/product'
import InputIcon from 'src/components/InputIcon'
import { Product } from 'src/types/product.type'
import { cn } from 'src/utils/utils.ts'
import ProductCard from './ProductCard'

const ProductSearch = () => {
    const [search, setSearch] = useState<string>('')
    const [scrollId, setScrollId] = useState<string | undefined>(undefined)
    const [open, setOpen] = useState<boolean>(false)
    const [product, setProduct] = useState<Product[] | undefined>(undefined)
    const scrollableNodeRef = useRef<HTMLDivElement | null>()
    const [fetchInFirst, setFetchInFirst] = useState<boolean>(false)
    const [fetchAfterFirst, setFetchAfterFirst] = useState<boolean>(false)

    const { data, refetch: searchProductRefetch } = useQuery({
        queryKey: ['productSearch', search],
        queryFn: () => productFetching.searchProduct({ query: search, scroll: '2m', scroll_id: scrollId }),
        enabled: false,
        select: (data) => data.data.result
    })

    const hanleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
        setScrollId(undefined)
    }

    const handleSearchSubmit = () => {
        setFetchInFirst(true)
        searchProductRefetch()
        if (!scrollId) {
            setProduct(undefined)
        }
    }

    const handleFetchAfterFirst = () => {
        setFetchAfterFirst(true)
        searchProductRefetch()
    }

    const onMount = () => {}

    if (scrollableNodeRef && scrollableNodeRef.current) {
        scrollableNodeRef.current.onscrollend = () => {
            if (data && data.data.length > 0) {
                handleFetchAfterFirst()
            }
        }
    }

    useEffect(() => {
        if (data) {
            if (!data.data.length) {
                setFetchInFirst(false)
                setScrollId(undefined)
                setFetchAfterFirst(false)
                return
            }
            setScrollId(data.scroll_id)
            setFetchInFirst(false)
            setProduct((pre) => {
                if (!pre) {
                    return data.data
                }
                return [...pre, ...data.data]
            })
        }
    }, [data])

    return (
        <>
            <InputIcon
                icon={<IoSearchOutline size={22} className='text-gray-400' />}
                placeholder='Tìm kiếm sản phẩm'
                rootClassName='basis-2/5'
                onClick={() => setOpen(true)}
            />
            <Dialog.Root onOpenChange={setOpen} open={open}>
                <Dialog.Content maxWidth='1000px' className='!rounded-8'>
                    <Dialog.Title>Tìm kiếm sản phẩm</Dialog.Title>
                    <Flex direction={'column'} gapY={'4'}>
                        <Flex direction={'column'} gapY={'1'}>
                            <Flex gapX={'2'} align={'stretch'}>
                                <TextField.Root
                                    className='flex-grow'
                                    placeholder='Nhập từ khóa...'
                                    size={'3'}
                                    value={search}
                                    onChange={hanleSearchChange}
                                >
                                    <TextField.Slot>
                                        <MagnifyingGlassIcon height='20' width='20' />
                                    </TextField.Slot>
                                </TextField.Root>
                                <Button size={'3'} onClick={handleSearchSubmit}>
                                    {fetchInFirst && <Spinner />} Tìm Kiếm
                                </Button>
                            </Flex>
                            {data && <Text color='red'>{!data.total ? 0 : data.total} kết quả tìm kiếm phù hợp</Text>}
                        </Flex>
                        <SimpleBar
                            style={{ maxHeight: '600px', overflowX: 'hidden' }}
                            scrollableNodeProps={{ ref: scrollableNodeRef }}
                        >
                            {product && product.length > 0 ? (
                                <>
                                    <Grid columns={'3'} gap={'3'}>
                                        {product.map((e, idx) => (
                                            <ProductCard key={idx} product={e} isHiddenStore />
                                        ))}
                                    </Grid>
                                    {fetchAfterFirst && (
                                        <Flex
                                            justify={'center'}
                                            className={cn('my-5', {
                                                'my-0': data && !data.data.length
                                            })}
                                        >
                                            <Spinner size={'3'} />
                                        </Flex>
                                    )}
                                </>
                            ) : (
                                <Flex justify={'center'} align={'center'}>
                                    <img
                                        src='https://cdn-icons-png.flaticon.com/512/3002/3002827.png'
                                        className='w-32 h-3w-32'
                                        alt='search'
                                    />
                                </Flex>
                            )}
                        </SimpleBar>
                    </Flex>
                    <Flex gap='3' mt='4' justify='end'>
                        <Dialog.Close>
                            <Button size={'3'} color='red' onClick={onMount}>
                                Trở về
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </>
    )
}

export default ProductSearch
