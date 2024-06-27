import { PrismaService } from '@app/common/prisma/prisma.service'
import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Order, Prisma } from '@prisma/client'
import { getOrderByRating, getProductOrderByRating } from 'common/constants/event.constant'
import { PaginationDTO } from 'common/decorators/pagination.dto'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { flatten, isUndefined, omitBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateRatingDto } from './dtos/create-rating.dto'
import { RatingQueryDTO } from './dtos/rating-query.dto'
import { CreateReplyRatingDTO } from './dtos/reply-rating.dto'

@Injectable()
export class RatingService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
        @Inject('PRODUCT_SERVICE') private productClient: ClientProxy
    ) {}

    // async getDetail(ratingId: string): Promise<Return> {
    //     const ratingExist = await this.prisma.rating.findUnique({
    //         where: {
    //             id: ratingId
    //         }
    //     })

    //     if (!ratingExist) {
    //         throw new NotFoundException('Đánh giá không tồn tại')
    //     }
    //     const materialsRating = await this.prisma.ratingMaterial.findMany({
    //         where: {
    //             ratingId: ratingExist.id
    //         }
    //     })

    //     const reply = await this.prisma.ratingReply.findMany({
    //         where: {
    //             ratingId: ratingExist.id
    //         }
    //     })

    //     const materialsReply = keyBy(
    //         await Promise.all(
    //             reply.map((re) =>
    //                 this.prisma.ratingMaterial.findMany({
    //                     where: {
    //                         ratingReplyId: re.id
    //                     }
    //                 })
    //             )
    //         ),
    //         'ratingReplyId'
    //     )

    //     return {
    //         msg: 'ok',
    //         result: {
    //             rating: ratingExist,
    //             ratingMaterial: materialsRating,
    //             reply: reply,
    //             replyMaterial: materialsReply
    //         }
    //     }
    // }

    async getAllRatingByProduct(
        productId: string,
        storeId: string,
        query: PaginationDTO
    ): Promise<Return> {
        const { limit, page } = query
        const limitExist = limit | this.configService.get('app.limit_default')

        const [orderIdsRelatived, storeRating] = await Promise.all([
            this.prisma.productOrder.findMany({
                where: {
                    productId
                },
                distinct: 'orderId',
                select: {
                    orderId: true
                }
            }),
            this.prisma.storeRating.findFirst({
                where: {
                    storeId
                }
            })
        ])

        const convertedStoreRating = orderIdsRelatived.map((e) => e.orderId)

        let { id, storeId: a, createdAt, updatedAt, ...rest } = storeRating

        const ratings = await this.prisma.rating.findMany({
            where: {
                orderId: {
                    in: convertedStoreRating
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                RatingReply: {
                    take: 1
                }
            },
            take: limitExist,
            skip: page && page > 1 ? (page - 1) * limitExist : 0
        })

        return {
            msg: 'ok',
            result: {
                data: {
                    totalRatingData: {
                        rest
                    },
                    detailRatingData: ratings
                },
                query: omitBy(
                    {
                        ...query,
                        page: page || 1,
                        page_size: storeRating?.total
                            ? Math.ceil(storeRating.total / limitExist)
                            : 0
                    },
                    isUndefined
                )
            }
        }
    }

    async moreRating(parentRatingId: string): Promise<Return> {
        return {
            msg: 'ok',
            result: await this.prisma.ratingReply.findMany({
                where: {
                    parentRatingId
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })
        }
    }

    async getAllRatingByStore(store: CurrentStoreType, query: RatingQueryDTO): Promise<Return> {
        const { storeId } = store
        const { createdAt, endDate, startDate, limit, page, replier, reply } = query
        const limitExist = limit || this.configService.get<number>('app.limit_default')

        const [length, ratings] = await Promise.all([
            this.prisma.rating.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    },
                    storeId,
                    isReply: reply
                }
            }),
            this.prisma.rating.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    },
                    storeId,
                    isReply: reply
                },
                include: {
                    RatingReply: {
                        where: {
                            createdBy: replier
                        }
                    }
                },
                orderBy: {
                    createdAt
                },
                take: limitExist,
                skip: page && page > 1 ? (page - 1) * limitExist : 0
            })
        ])

        return {
            msg: 'ok',
            result: {
                data: {
                    totalRatingData: {
                        ratingValue: 1,
                        numOfRating: 1
                    }
                },
                query: omitBy(
                    {
                        ...query,
                        page: page || 1,
                        page_size: Math.ceil(length / limitExist)
                    },
                    isUndefined
                )
            }
        }
    }

    async createNewRating(user: CurrentUserType, body: CreateRatingDto): Promise<Return> {
        try {
            const { id } = user
            const { comment, orderId, storeId, stars, urls } = body
            const ratingId = uuidv4()

            const ratingExist = await this.prisma.rating.findFirst({
                where: {
                    orderId,
                    storeId,
                    createdBy: id
                }
            })

            if (ratingExist) {
                throw new BadRequestException('Đã tồn tại đánh giá cho đơn hàng này')
            }

            const [orderExist, storeExist, storeRating] = await Promise.all([
                this.prisma.order.findUnique({
                    where: {
                        id: orderId,
                        userId: user.id
                    }
                }),
                this.prisma.store.findUnique({
                    where: {
                        id: storeId
                    }
                }),
                this.prisma.storeRating.findFirst({
                    where: {
                        storeId
                    }
                })
            ])

            if (!orderExist) {
                throw new BadRequestException(
                    'Mã đơn hàng không đúng hoặc bạn chưa thực hiện đơn hàng này'
                )
            }
            if (!storeExist) {
                throw new BadRequestException('Mã cửa hàng không đúng')
            }

            const tmp: Record<number, keyof Prisma.StoreRatingCreateInput> = {
                1: 'one',
                2: 'two',
                3: 'three',
                4: 'four',
                5: 'five'
            }

            if (!storeRating) {
                let storeRatingId = uuidv4()

                await this.prisma.$transaction([
                    this.prisma.storeRating.create({
                        data: {
                            id: storeRatingId,
                            storeId,
                            [tmp[stars]]: 1
                        }
                    }),
                    this.prisma.order.update({
                        where: {
                            id: orderId
                        },
                        data: {
                            isRated: true
                        }
                    })
                ])
            } else {
                await this.prisma.storeRating.update({
                    where: {
                        id: storeRating.id
                    },
                    data: {
                        [tmp[stars]]: +storeRating?.[tmp[stars]] + 1,
                        total: storeRating.total + 1,
                        average: (storeRating.average + stars) / 2,
                        updatedAt: new Date()
                    }
                })
            }

            await this.prisma.$transaction(async (tx) => {
                return await Promise.all([
                    tx.rating.create({
                        data: {
                            id: ratingId,
                            storeId,
                            orderId,
                            stars,
                            comment,
                            createdAt: new Date(),
                            createdBy: id,
                            isReply: false
                        }
                    }),
                    ...urls.map(({ url, isPrimary }) =>
                        tx.ratingMaterial.create({
                            data: {
                                id: uuidv4(),
                                isPrimary: isPrimary || false,
                                url,
                                ratingId
                            }
                        })
                    )
                ])
            })

            return {
                msg: 'ok',
                result: undefined
            }
        } catch (err) {
            throw new InternalServerErrorException('Lỗi Server')
        }
    }

    async replyRating(store: CurrentStoreType, body: CreateReplyRatingDTO): Promise<Return> {
        const { userId } = store
        const { detail, parentRatingId, urls } = body
        const ratingExist = await this.prisma.rating.findUnique({
            where: {
                id: parentRatingId
            }
        })

        if (!ratingExist) {
            throw new NotFoundException('Đánh giá không tồn tại')
        }

        const replyId = uuidv4()

        const [_, createdReply, ...materials] = await this.prisma.$transaction(async (tx) => {
            return await Promise.all([
                tx.rating.update({
                    where: {
                        id: parentRatingId
                    },
                    data: {
                        isReply: true
                    }
                }),
                tx.ratingReply.create({
                    data: {
                        id: replyId,
                        createdAt: new Date(),
                        createdBy: userId,
                        detail,
                        parentRatingId
                    }
                }),
                ...urls.map(({ url, isPrimary = false }) =>
                    tx.ratingMaterial.create({
                        data: {
                            id: uuidv4(),
                            url,
                            isPrimary,
                            ratingReplyId: replyId
                        }
                    })
                )
            ])
        })

        return {
            msg: 'ok',
            result: {
                reply: createdReply,
                materials
            }
        }
    }

    async ratingExist(user: CurrentUserType, productId: string): Promise<Return> {
        try {
            const orderIds = (
                await this.prisma.rating.findMany({
                    where: {
                        createdBy: user.id
                    }
                })
            ).map((e) => e.orderId)

            const orders = (
                (await firstValueFrom(
                    this.orderClient.send(getOrderByRating, { userId: user.id, orderIds })
                )) as Order[]
            ).map((e) => {
                if (e) return e.id
            })

            if (!orders.length) {
                return {
                    msg: 'ok',
                    result: false
                }
            }

            const productOrders = flatten(
                await firstValueFrom(
                    this.productClient.send(getProductOrderByRating, { productId, orders })
                )
            )

            if (!productOrders.length) {
                return {
                    msg: 'ok',
                    result: false
                }
            }

            return {
                msg: 'ok',
                result: productOrders
            }
        } catch (err) {
            throw new BadRequestException('Lỗi BE')
        }
    }
}
