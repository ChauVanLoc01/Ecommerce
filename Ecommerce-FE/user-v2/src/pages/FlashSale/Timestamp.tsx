import { getHours } from 'date-fns'

type TimestampProps = {
    hour: number
    hourText: string
    isActive: boolean
}

const Timestamp = ({ hour, hourText, isActive }: TimestampProps) => {
    const now = new Date()
    const currentHour = getHours(now)
    return (
        <div
            className={
                'flex flex-col w-full h-20 justify-center items-center ' +
                (isActive ? 'bg-amber-600' : 'bg-neutral-700')
            }
        >
            <p className='text-white text-lg'>{hourText}</p>
            <p className='text-white'>{currentHour == hour ? 'Đang diễn ra' : 'Sắp diễn ra'}</p>
        </div>
    )
}

export default Timestamp
