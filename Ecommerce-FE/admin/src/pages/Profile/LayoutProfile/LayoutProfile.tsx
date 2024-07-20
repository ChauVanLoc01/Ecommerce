import { Flex, Text } from '@radix-ui/themes'
import { ReactNode, useEffect } from 'react'

type LayoutProfileProps = {
    title: string
    children: ReactNode
    rightNode?: ReactNode
    isFullHeight?: boolean
}

const LayoutProfile = ({ title, isFullHeight, children, rightNode }: LayoutProfileProps) => {
    const idContainer = title.replace(/\s+/gim, '')

    useEffect(() => {
        if (isFullHeight) {
            document.querySelector(`#${idContainer}`)?.classList.add('h-[88%]')
        }
    }, [])

    return (
        <div id={idContainer} className='grow rounded-8 border border-border/30 bg-[#FFFFFF]'>
            <section className='border-b border-border/30 font-semibold p-20'>
                <Flex justify={'between'} align={'center'}>
                    <Text weight={'medium'} size={'4'}>
                        {title}
                    </Text>
                    {rightNode}
                </Flex>
            </section>
            <section className='p-20 space-y-6 min-h-full'>{children}</section>
        </div>
    )
}

export default LayoutProfile
