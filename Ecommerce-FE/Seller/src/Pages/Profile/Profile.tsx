import classNames from 'classnames'

function Profile() {
  return (
    <div className='rounded-xs bg-white py-5'>
      <form className='flex p-3 justify-evenly'>
        <div className='space-y-3'>
          <div className='text-center col-span-2 col-start-1 font-semibold text-lg pb-3'>Hồ sơ Shop</div>
          <div className='flex items-center space-x-7'>
            <label className='self-center' htmlFor='username'>
              Tên Shop
            </label>
            <div className='relative'>
              <span className='absolute top-0 -translate-y-1/2 left-2 px-1 bg-white lg:text-sm text-xs text-red-500'></span>
              <input
                className={classNames(
                  'w-full hover:ring-1 ring-[#2579F2] focus:ring-1 outline-none border border-gray-300 rounded-xs lg:px-3 px-2 py-1'
                )}
                type='text'
                id='username'
              />
            </div>
          </div>
          <div className='col-start-2 text-right py-1'>
            <button
              type='submit'
              className='ring-[1px] ring-gray-300 hover:ring-[#2579F2] rounded-xs px-5 py-1 text-[#2579F2] font-semibold'
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
        <div className='space-y-3 flex flex-col w-fit'>
          <img
            className='bg-cover rounded-full xl:w-32 lg:w-28 self-center object-cover'
            src='https://cdn.divineshop.vn/image/catalog/icon/avatar-khach-hang-2-52544.png?hash=1649933269'
            alt='avatar'
          />
          <div className='text-center'>
            <button
              type='button'
              className='px-3 py-1 rounded-xs bg-[#2579F2] text-white hover:bg-[#2579F2]/90 ring-2 ring-[#2579F2]/90 hover:ring-[#2579F2] lg:scale-100 md:scale-90'
            >
              Thay đổi ảnh Shop
            </button>
          </div>
        </div>
      </form>
      <input type='file' className='invisible absolute bottom-0' accept='image/*' />
    </div>
  )
}

export default Profile
