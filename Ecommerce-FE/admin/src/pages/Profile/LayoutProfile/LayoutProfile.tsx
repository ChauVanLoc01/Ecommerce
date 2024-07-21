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
            let layout_container = document.querySelector(`#${idContainer}`)
            layout_container?.classList.add('h-[88%]')
        }
    }, [])

    return (
        <div id={idContainer} className='rounded-8 border border-border/30 bg-[#FFFFFF] mb-20'>
            <section id='store-banner' className='border-b border-border/30 font-semibold p-20'>
                <Flex justify={'between'} align={'center'}>
                    <Text weight={'medium'} size={'4'}>
                        {title}
                    </Text>
                    {rightNode}
                </Flex>
            </section>
            <section className='p-20 space-y-5 min-h-full max-h-full flex flex-col flex-grow-0 [&:last-child]:flex-grow'>
                {children}
            </section>
        </div>
    )
}

export default LayoutProfile
