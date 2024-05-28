import { format } from 'date-fns'
import { ProfileResponse } from 'src/types/profile.type'
import { Rating, RatingMaterial } from 'src/types/rating.type'

type ReviewProps = {
    data: { rating: Rating; material: RatingMaterial[]; user: ProfileResponse }
}

const Review = ({ data }: ReviewProps) => {
    const { rating, user } = data
    return (
        <section className='rounded-12 p-[24px] flex gap-4 bg-[#F8F9FA]'>
            <img src={user.image} alt='review-img' className='rounded-full w-14 h-14' />
            <div className='space-y-2'>
                <h3 className='font-semibold text-sm'>Blake Howell</h3>
                <div className='text-gray-500 space-x-2'>
                    <span className='tracking-wider'>{format(rating.createdAt, 'dd-MM-yyyy')}</span>
                    <span className='tracking-wider'>{format(rating.createdAt, 'hh:mm')}</span>
                </div>
                <p className='text-gray-500 tracking-wider leading-5'>{rating.detail}</p>
            </div>
        </section>
    )
}

export default Review
