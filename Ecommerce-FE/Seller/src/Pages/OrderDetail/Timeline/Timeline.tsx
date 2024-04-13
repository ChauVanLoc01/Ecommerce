import { Timeline as TimelineAntd } from 'antd'

const Timeline = () => {
    return (
        <TimelineAntd
            items={[
                {
                    color: 'green',
                    children: 'Create a services site 2015-09-01'
                },
                {
                    color: 'green',
                    children: 'Create a services site 2015-09-01'
                },
                {
                    color: 'red',
                    children: (
                        <>
                            <p>Solve initial network problems 1</p>
                            <p>Solve initial network problems 2</p>
                            <p>Solve initial network problems 3 2015-09-01</p>
                        </>
                    )
                }
            ]}
        />
    )
}

export default Timeline
