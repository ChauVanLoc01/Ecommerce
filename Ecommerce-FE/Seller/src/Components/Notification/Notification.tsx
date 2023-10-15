import { Link } from 'react-router-dom'

type NotificationProps = {
  rootClass?: string
  imgClass?: string
  titleClass?: string
  footerClass?: string
}

function Notification({ imgClass, titleClass, footerClass, rootClass }: NotificationProps) {
  return (
    <article className={`flex justify-start ${rootClass}`}>
      <div className='basis-2/12'>
        <img
          className={`object-cover bg-cover ${imgClass}`}
          src='https://cf.shopee.vn/file/565277eec233892490bc426672ab6165'
          alt='img'
        />
      </div>
      <div className='basis-10/12'>
        <Link to={'/'} className={titleClass}>
          <p className='line-clamp-2'>Bạn nói Shopee lắng nghe</p>
          <p className='line-clamp-3'>
            Hãy kể cho Shopee nghe về trải nghiệm mua sắm của bạnHãy kể cho Shopee nghe về trải nghiệm mua sắm của bạn
          </p>
        </Link>
        <div className={footerClass}>
          <span className='pr-2 border-r border-gray-400'>Từ Shopee</span>
          <span className='pl-2'>20:00 28/08/2023</span>
        </div>
      </div>
    </article>
  )
}

export default Notification
