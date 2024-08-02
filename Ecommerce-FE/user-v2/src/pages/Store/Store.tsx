import { CalendarIcon, ChatBubbleIcon, HomeIcon, PersonIcon, PlusIcon, StarIcon } from '@radix-ui/react-icons'
import { Avatar, Box, DataList, Flex, Tabs, Text } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect } from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import { StoreFetching } from 'src/apis/store'
import { AppContext } from 'src/contexts/AppContext'
import { Product } from 'src/types/product.type'
import { Store as StoreType } from 'src/types/store.type'
import Home from './Home'
import ProductAll from './ProductAll'

const Store = () => {
    const { profile } = useContext(AppContext)
    const params = useParams()
    const [storeDetail, solds, news] = useLoaderData() as [StoreType, Product[], Product[]]
    const { mutate: userViewStore } = useMutation({
        mutationFn: StoreFetching.userViewStore({ userId: profile?.user?.id, storeId: params.storeId || '' })
    })

    useEffect(() => {
        userViewStore()
    }, [])

    return (
        <div className='space-y-5'>
            <Flex gapX={'9'}>
                <div className='bg-center basis-2/5 object-cover p-4 rounded-8 bg-[url("https://i.pinimg.com/564x/9d/1f/2e/9d1f2e441590c09d737125a61b5f5281.jpg")]'>
                    <Flex gapX={'4'}>
                        <Avatar fallback='A' src={storeDetail.image} size={'7'} radius='full' />
                        <div className='flex flex-col justify-around flex-grow py-1'>
                            <Text size={'6'} className='!text-white'>
                                {storeDetail.name}
                            </Text>
                            <div className='flex gap-x-2'>
                                <button className='text-white border border-white rounded-6 px-2 py-1 hover:bg-white/10 flex items-center justify-center space-x-1 flex-grow'>
                                    <PlusIcon width={20} height={20} fontWeight={600} />
                                    <span>Theo dõi</span>
                                </button>
                                <button className='text-white border border-white rounded-6 px-2 py-1 hover:bg-white/10 flex items-center justify-center space-x-2 flex-grow'>
                                    <ChatBubbleIcon />
                                    <span>Chat</span>
                                </button>
                            </div>
                        </div>
                    </Flex>
                </div>
                <Flex gapX={'9'}>
                    <DataList.Root>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='20px'>
                                <HomeIcon width={22} height={22} />
                            </DataList.Label>
                            <DataList.Value>
                                Sản phẩm:
                                <span className='ml-1 text-red-600'>7.8k</span>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='20px'>
                                <PersonIcon width={22} height={22} />
                            </DataList.Label>
                            <DataList.Value>
                                Người theo dõi:
                                <span className='ml-1 text-red-600'>7.8k</span>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                    <DataList.Root>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='20px'>
                                <StarIcon width={25} height={25} />
                            </DataList.Label>
                            <DataList.Value>
                                Đánh giá:
                                <span className='ml-1 text-red-600'>4.8 (17.8k lượt)</span>
                            </DataList.Value>
                        </DataList.Item>
                        <DataList.Item align='center'>
                            <DataList.Label minWidth='20px'>
                                <CalendarIcon width={20} height={20} />
                            </DataList.Label>
                            <DataList.Value>
                                Tham gia:
                                <span className='ml-1 text-red-600'>6 năm trước</span>
                            </DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </Flex>
            </Flex>
            <Tabs.Root defaultValue='home'>
                <Tabs.List size={'2'} color='orange'>
                    <Tabs.Trigger value='home'>
                        <Text weight={'medium'} size={'3'}>
                            Trang chủ
                        </Text>
                    </Tabs.Trigger>
                    <Tabs.Trigger value='product'>
                        <Text weight={'medium'} size={'3'}>
                            Sản phẩm
                        </Text>
                    </Tabs.Trigger>
                </Tabs.List>
                <Box pt='5'>
                    <Tabs.Content value='home'>
                        <Home programs={news} />
                    </Tabs.Content>
                    <Tabs.Content value='product'>
                        <ProductAll products={solds} />
                    </Tabs.Content>
                </Box>
            </Tabs.Root>
        </div>
    )
}

export default Store
