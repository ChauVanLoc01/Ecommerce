import Digit from '../Digit'

const Digits = ({ value }: any) => {
    const d1 = Math.floor(value / 10)
    const d2 = Math.floor(value - d1 * 10)
    return (
        <div className='bg-[#000000] rounded-6 flex justify-evenly overflow-hidden relative'>
            <Digit digitClassName='right-[56%]' value={d1} />
            <Digit digitClassName='left-[56%]' value={d2} />
        </div>
    )
}

export default Digits
