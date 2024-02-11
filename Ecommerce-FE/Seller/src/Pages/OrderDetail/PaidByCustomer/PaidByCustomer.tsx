import Table, { ColumnsType } from 'antd/es/table'

type TableHeaderData = {
    id: string
    product_name: string
    quantity: number
    price: number
    total: number
}

const PaidByCustomer = () => {
    const columns: ColumnsType<TableHeaderData> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product_name',
            key: 'product_name'
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total'
        }
    ]

    const data: TableHeaderData[] = [
        {
            id: '1',
            product_name: 'Áo thun name',
            price: 200000,
            quantity: 1,
            total: 200000
        },
        {
            id: '2',
            product_name: 'Áo thun name',
            price: 200000,
            quantity: 1,
            total: 200000
        },
        {
            id: '3',
            product_name: 'Áo thun name',
            price: 200000,
            quantity: 1,
            total: 200000
        }
    ]

    return (
        <Table
            className='mb-2'
            columns={columns}
            dataSource={data}
            pagination={false}
        />
    )
}

export default PaidByCustomer
