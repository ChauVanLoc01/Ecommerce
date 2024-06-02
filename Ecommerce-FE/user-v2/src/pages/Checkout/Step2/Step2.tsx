import { Badge, Box, Flex, RadioCards, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { profileFetching } from 'src/apis/profile'
import { cn } from 'src/utils/utils.ts'
import CreateAddress from './CreateAddress'

type Step2Props = {
    addressId: string
    setAddressId: React.Dispatch<React.SetStateAction<string>>
}

const Step2 = ({ addressId, setAddressId }: Step2Props) => {
    const [open, setOpen] = useState<boolean>(false)

    const deliveriesQuery = useQuery({
        queryKey: ['delivery'],
        queryFn: profileFetching.getDeliveries,
        staleTime: Infinity,
        gcTime: Infinity,
        enabled: false
    })

    useEffect(() => {
        if (deliveriesQuery.data?.data) {
            setAddressId(deliveriesQuery.data?.data.result.find((delivery) => delivery.isPrimary)?.id as string)
        }
    }, [deliveriesQuery.data?.data])

    return (
        <section className='p-24 rounded-8 border border-border/30 bg-[#FFFFFF] space-y-4'>
            <Flex justify={'end'}>
                <CreateAddress open={open} setOpen={setOpen} refetchDelivery={deliveriesQuery.refetch} />
            </Flex>
            <Box>
                <RadioCards.Root
                    value={addressId}
                    onValueChange={setAddressId}
                    columns={{ initial: '1', sm: '3' }}
                    color='blue'
                >
                    {deliveriesQuery.data?.data.result.map((delivery) => (
                        <RadioCards.Item
                            value={delivery.id}
                            className={cn({
                                '!relative': delivery.isPrimary
                            })}
                            key={delivery.id}
                        >
                            <Flex direction='column' width='100%'>
                                <Text weight='bold'>{delivery.full_name}</Text>
                                <Text size={'1'} color='gray'>
                                    {delivery.phone}
                                </Text>
                                <Text size={'1'} color='gray' className=''>
                                    {delivery.address}
                                </Text>
                            </Flex>
                            {delivery.isPrimary && (
                                <Badge color='blue' className='absolute top-2 right-2'>
                                    Mặc định
                                </Badge>
                            )}
                        </RadioCards.Item>
                    ))}
                </RadioCards.Root>
            </Box>
        </section>
    )
}

export default Step2
