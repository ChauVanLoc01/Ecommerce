import { Flex, Select, Text, TextField } from '@radix-ui/themes'
import LayoutProfile from '../Profile/LayoutProfile'
import ProductTable from './ProductTable'

const Product = () => {
    return (
        <LayoutProfile title='Quản lý sản phẩm'>
            <div className='bg-white rounded-8 border-border/30 space-y-4'>
                <Text weight='medium'>5/10 Nhân viên</Text>
                <Flex justify='between' width='100%'>
                    <TextField.Root placeholder='Tìm kiếm sản phẩm...' size='3'>
                        <TextField.Slot>
                            <svg
                                width='17'
                                height='17'
                                viewBox='0 0 15 15'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z'
                                    fill='currentColor'
                                    fill-rule='evenodd'
                                    clip-rule='evenodd'
                                ></path>
                            </svg>
                        </TextField.Slot>
                    </TextField.Root>
                    <Flex direction='column' width='180px'>
                        <Select.Root size='3' defaultValue='all'>
                            <Select.Trigger />
                            <Select.Content position='popper'>
                                <Select.Item value='all'>Tất cả</Select.Item>
                                <Select.Item value='cancel'>Đã hủy</Select.Item>
                                <Select.Item value='success'>Thành công</Select.Item>
                                <Select.Item value='waiting'>Chờ xác nhận</Select.Item>
                            </Select.Content>
                        </Select.Root>
                    </Flex>
                </Flex>
                <ProductTable />
            </div>
        </LayoutProfile>
    )
}

export default Product
