type StarProps = {
    count: number
}

const Star = ({ count }: StarProps) => {
    let starWhite = Array(5)
        .fill(0)
        .map((_) => <span>★</span>)

    let starYellow = Array(5)
        .fill(0)
        .map((_, idx) => (
            <span key={`star_${count}_${idx}`} className='text-yellow-500'>
                ★
            </span>
        ))

    return <>{[...starYellow, ...starWhite].slice(5 - count, -count)}</>
}

export default Star
