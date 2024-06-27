interface RatingReadOnlyProps {
    ratingValue: number
}

export const RatingReadOnly: React.FC<RatingReadOnlyProps> = ({ ratingValue }) => {
    return (
        <div>
            {[1, 2, 3, 4, 5].map((star) => {
                return (
                    <span
                        className='start'
                        style={{
                            cursor: 'pointer',
                            color: ratingValue >= star ? 'gold' : 'gray',
                            fontSize: `20px`
                        }}
                    >
                        {' '}
                        ★{' '}
                    </span>
                )
            })}
        </div>
    )
}
export default RatingReadOnly
