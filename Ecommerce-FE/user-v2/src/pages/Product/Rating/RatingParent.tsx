import { Avatar, Box, Flex, Grid, Skeleton, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { RatingApi } from 'src/apis/rating.api'
import { dateFormat } from 'src/constants/date-format'
import { DataRatingListResponse } from 'src/types/rating.type'
import Star from './Star'

type RatingParentProps = {
    data: DataRatingListResponse['data']['ratings'][number]
}

const RatingParent = ({ data }: RatingParentProps) => {
    let { comment, stars, createdAt, createdBy, id, RatingReply } = data

    const { data: user } = useQuery({
        queryKey: ['rating_user', data.createdBy],
        queryFn: RatingApi.getRatingUserProfile(createdBy),
        select: (data) => data.data.result,
        staleTime: 1000 * 60 * 5
    })

    const { data: materials } = useQuery({
        queryKey: ['rating_material', id],
        queryFn: RatingApi.getMaterialOfRating(id),
        select: (data) => data.data.result,
        staleTime: 1000 * 60 * 5
    })

    return (
        <div className='user-comment flex flex-col w-full h-full flex-start space-y-2'>
            <Flex gap='3' align='center'>
                {user?.image ? (
                    <Avatar size='3' src={user.image} radius='full' loading='lazy' fallback='T' />
                ) : (
                    <Skeleton width={'40'} height={'40px'} className='rounded-full' />
                )}
                <Box>
                    {user?.full_name ? (
                        <Text as='div' size='2' weight='bold'>
                            {user.full_name}
                        </Text>
                    ) : (
                        <Skeleton width={'100px'} height={'15px'} />
                    )}
                    <div>
                        <Star count={stars} />
                        <Text className='ml-2 time text-sm text-gray-900'>
                            Nhận xét lúc {format(createdAt, dateFormat)}
                        </Text>
                    </div>
                </Box>
            </Flex>
            <div className='flex flex-col w-full h-full items-start px-4 py-3 space-y-2 border border-gray-200 bg-gray-50 rounded-md relative'>
                <Text className='text-md'>{comment}</Text>
                <Grid columns={'4'}>
                    {materials
                        ? materials.map((url) => (
                              <Avatar size={'5'} fallback={'rating-image'} src={url} className='rounded-6' />
                          ))
                        : Array(4)
                              .fill(0)
                              .map((_) => <Skeleton width={'50px'} height={'50px'} className='rounded-8' />)}
                </Grid>
                {RatingReply?.[0] && (
                    <div className='rounded-6 bg-gray-100 px-5 py-2 flex flex-col absolute bottom-2 right-2 max-w-80 max-h-20'>
                        <Text size={'2'} className='font-bold'>
                            Phản hồi từ người bán:
                        </Text>
                        <Text size={'2'} className='line-clamp-3'>
                            {RatingReply[0].detail}
                        </Text>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RatingParent
