import Sidebar from 'src/Components/Sidebar'

function Home() {
  return (
    <div className='flex'>
      <div className='basis-1/5'>
        <Sidebar />
      </div>
      <div className='p-2 text-xs basis-4/5'>
        {/* Danh sách việc cần làm */}
        <div className='bg-white rounded-sm px-3 py-2 shadow-sm'>
          <section className='space-y-3'>
            <div className='space-y-2'>
              <div className='font-semibold text-sm'>Danh sách cần làm</div>
              <span>Những việc bạn sẽ phải làm</span>
            </div>
            <div className='space-y-4'>
              <div className='grid grid-cols-4 divide-x divide-gray-200'>
                <div>
                  <button className='hover:bg-gray-100 py-2 rounded-[4px] justify-center items-center space-y-1 flex flex-col w-full h-full'>
                    <span className='text-blue-700 font-semibold'>0</span>
                    <span>Chờ xác nhận</span>
                  </button>
                </div>
                <div>
                  <button className='hover:bg-gray-100 py-2 rounded-[4px] justify-center items-center space-y-1 flex flex-col w-full h-full'>
                    <span className='text-blue-700 font-semibold'>0</span>
                    <span>Chờ lấy hàng</span>
                  </button>
                </div>
                <div>
                  <button className='hover:bg-gray-100 py-2 rounded-[4px] justify-center items-center space-y-1 flex flex-col w-full h-full'>
                    <span className='text-blue-700 font-semibold'>0</span>
                    <span>Đã xử lý</span>
                  </button>
                </div>
                <div>
                  <button className='hover:bg-gray-100 py-2 rounded-[4px] justify-center items-center space-y-1 flex flex-col w-full h-full'>
                    <span className='text-blue-700 font-semibold'>0</span>
                    <span>Đơn hủy</span>
                  </button>
                </div>
              </div>
              <div className='grid grid-cols-4 divide-x divide-gray-200'>
                <div>
                  <button className='hover:bg-gray-100 py-2 rounded-[4px] justify-center items-center space-y-1 flex flex-col w-full h-full'>
                    <span className='text-blue-700 font-semibold'>0</span>
                    <span>Trả hàng / Hoàn tiền chờ xử lý</span>
                  </button>
                </div>
                <div>
                  <button className='hover:bg-gray-100 py-2 rounded-[4px] justify-center items-center space-y-1 flex flex-col w-full h-full'>
                    <span className='text-blue-700 font-semibold'>0</span>
                    <span>Sản phẩm bị tạm khóa</span>
                  </button>
                </div>
                <div>
                  <button className='hover:bg-gray-100 py-2 rounded-[4px] justify-center items-center space-y-1 flex flex-col w-full h-full'>
                    <span className='text-blue-700 font-semibold'>0</span>
                    <span>Sản phẩm hết hàng</span>
                  </button>
                </div>
                <div>
                  <button className='hover:bg-gray-100 py-2 rounded-[4px] justify-center items-center space-y-1 flex flex-col w-full h-full'>
                    <span className='text-blue-700 font-semibold'>0</span>
                    <span>Chương trình khuyến mãi chờ xử lý</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Home
