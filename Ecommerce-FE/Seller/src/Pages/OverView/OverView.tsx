function OverView() {
  return (
    <div className='p-2 text-xs space-y-2'>
      <section className='space-y-3 bg-white rounded-xs px-3 py-2 shadow-sm hover:shadow-md'>
        <div className='space-y-2'>
          <div className='font-semibold text-sm'>Danh sách cần làm</div>
          <span>Những việc bạn sẽ phải làm</span>
        </div>
        <div className='space-y-4'>
          <div className='grid grid-cols-4 divide-x divide-gray-200'>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Chờ xác nhận</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Chờ lấy hàng</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Đã xử lý</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Đơn hủy</span>
              </button>
            </div>
          </div>
          <div className='grid grid-cols-4 divide-x divide-gray-200'>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Trả hàng / Hoàn tiền chờ xử lý</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Sản phẩm bị tạm khóa</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Sản phẩm hết hàng</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Chương trình khuyến mãi chờ xử lý</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className='space-y-3 bg-white rounded-xs px-3 py-2 shadow-sm hover:shadow-md'>
        <div className='space-y-2'>
          <div className='font-semibold text-sm'>Phân tích bán hàng</div>
          <span>Tổng quan dữ liệu của shop đối với đơn hàng đã xác nhận</span>
        </div>
        <div className='space-y-4'>
          <div className='grid grid-cols-4 divide-x divide-gray-200'>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Chờ xác nhận</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Chờ lấy hàng</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Đã xử lý</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Đơn hủy</span>
              </button>
            </div>
          </div>
          <div className='grid grid-cols-4 divide-x divide-gray-200'>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Trả hàng / Hoàn tiền chờ xử lý</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Sản phẩm bị tạm khóa</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Sản phẩm hết hàng</span>
              </button>
            </div>
            <div>
              <button className='hover:bg-gray-100 py-2 rounded-xs px-5 justify-center items-center space-y-1 flex flex-col w-full h-full'>
                <span className='text-blue-700 font-semibold'>0</span>
                <span>Chương trình khuyến mãi chờ xử lý</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OverView
