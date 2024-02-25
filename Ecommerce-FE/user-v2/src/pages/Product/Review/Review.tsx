const Review = () => {
    return (
        <section className='rounded-12 p-[24px] flex gap-4 bg-[#F8F9FA]'>
            <img
                src='https://i.pinimg.com/736x/4e/be/6a/4ebe6a508ee0df712264eb459cf53694.jpg'
                alt='review-img'
                className='rounded-full w-14 h-14'
            />
            <div className='space-y-2'>
                <h3 className='font-semibold text-sm'>Blake Howell</h3>
                <div className='text-gray-500 space-x-2'>
                    <span className='tracking-wider'>15/02/2024</span>
                    <span className='tracking-wider'>7:25:00 PM</span>
                </div>
                <p className='text-gray-500 tracking-wider leading-5'>
                    Zeudfud ajeite nuk wufce soko cih pew biefmo dipwusis
                    cincipa wad tuce ke vih. Fetabo jihcebkak raji hilcoki
                    karbal kas vitiwoh vobgivi jelcabi ugefaef cu ep tal lod
                    rut.
                </p>
            </div>
        </section>
    )
}

export default Review
