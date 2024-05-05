import { CalendarIcon, ChatBubbleIcon, HomeIcon, PersonIcon, PlusIcon, StarIcon } from '@radix-ui/react-icons'
import { Avatar, Box, Button, DataList, Flex, Tabs, Text } from '@radix-ui/themes'
import { useLoaderData } from 'react-router-dom'
import { Store as StoreType } from 'src/types/store.type'
import Home from './Home'
import Sold from './Sold'
import New from './New'
import { Product } from 'src/types/product.type'

const Store = () => {
    const [storeDetail, solds] = useLoaderData() as [StoreType, Product[]]

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
                    <Tabs.Trigger value='sold'>
                        <Text weight={'medium'} size={'3'}>
                            Sản phẩm bán chạy
                        </Text>
                    </Tabs.Trigger>
                    <Tabs.Trigger value='new'>
                        <Text weight={'medium'} size={'3'}>
                            Sản phẩm mới
                        </Text>
                    </Tabs.Trigger>
                </Tabs.List>
                <Box pt='3'>
                    <Tabs.Content value='home'>
                        <Home programs={solds} />
                    </Tabs.Content>

                    <Tabs.Content value='sold'>
                        <Sold />
                    </Tabs.Content>

                    <Tabs.Content value='new'>
                        <New />
                    </Tabs.Content>
                </Box>
            </Tabs.Root>
        </div>
    )
}

export default Store
