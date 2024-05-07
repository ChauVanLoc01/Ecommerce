import { Flex, Text } from '@radix-ui/themes'
import { ReactNode } from 'react'

type LayoutProfileProps = {
    title: string
    children: ReactNode
    rightNode?: ReactNode
}

const LayoutProfile = ({ title, children, rightNode }: LayoutProfileProps) => {
    return (
        <div className='grow rounded-8 border border-border/30 bg-[#FFFFFF]'>
            <section className='border-b border-border/30 font-semibold p-20'>
                <Flex justify={'between'}>
                    <Text weight={'medium'} size={'4'}>
                        {title}
                    </Text>
                    {rightNode}
                </Flex>
            </section>
            <section className='p-20'>{children}</section>
        </div>
    )
}

export default LayoutProfile
