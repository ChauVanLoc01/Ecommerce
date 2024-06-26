import { PrismaService } from '@app/common/prisma/prisma.service'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Order } from '@prisma/client'
import {
    getInfoUserInRating,
    getOrderByRating,
    getProductOrderByRating
} from 'common/constants/event.constant'
import { PaginationDTO } from 'common/decorators/pagination.dto'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { flatten, isUndefined, keyBy, omitBy } from 'lodash'
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
        @Inject('USER_SERVICE') private userClient: ClientProxy,
        @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
        @Inject('PRODUCT_SERVICE') private productClient: ClientProxy
    ) {}

    async getDetail(ratingId: string): Promise<Return> {
        const ratingExist = await this.prisma.rating.findUnique({
            where: {
                id: ratingId
            }
        })

        if (!ratingExist) {
            throw new NotFoundException('Đánh giá không tồn tại')
        }
        const materialsRating = await this.prisma.ratingMaterial.findMany({
            where: {
                ratingId: ratingExist.id
            }
        })

        const reply = await this.prisma.ratingReply.findMany({
            where: {
                ratingId: ratingExist.id
            }
        })

        const materialsReply = keyBy(
            await Promise.all(
                reply.map((re) =>
                    this.prisma.ratingMaterial.findMany({
                        where: {
                            ratingReplyId: re.id
                        }
                    })
                )
            ),
            'ratingReplyId'
        )

        return {
            msg: 'ok',
            result: {
                rating: ratingExist,
                ratingMaterial: materialsRating,
                reply: reply,
                replyMaterial: materialsReply
            }
        }
    }

    async getAllRatingByProduct(productId: string, query: PaginationDTO): Promise<Return> {
        const { limit, page } = query
        const limitExist = limit | this.configService.get('app.limit_default')

        const [length, ratings] = await Promise.all([
            this.prisma.rating.count({
                where: {
                    productId
                }
            }),
            this.prisma.rating.findMany({
                where: {
                    productId
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limitExist,
                skip: page && page > 1 ? (page - 1) * limitExist : 0
            })
        ])

        return {
            msg: 'ok',
            result: {
                data: ratings,
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

    async getAllRatingByStore(store: CurrentStoreType, query: RatingQueryDTO): Promise<Return> {
        const { storeId } = store
        const { createdAt, endDate, startDate, limit, page, replier, reply } = query
        const limitExist = limit | this.configService.get('app.limit_default')

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
                data: ratings,
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
        const { id } = user
        const { comment, orderId, productId, storeId, stars, urls } = body
        const ratingId = uuidv4()

        const [orderExist, productExist, storeExist] = await Promise.all([
            this.prisma.order.findUnique({
                where: {
                    id: orderId,
                    userId: user.id
                }
            }),
            this.prisma.product.findUnique({
                where: {
                    id: productId
                }
            }),
            this.prisma.store.findUnique({
                where: {
                    id: storeId
                }
            })
        ])

        if (!orderExist) {
            throw new BadRequestException(
                'Mã đơn hàng không đúng hoặc bạn chưa thực hiện đơn hàng này'
            )
        }
        if (!productExist) {
            throw new BadRequestException('Mã sản phẩm không đúng')
        }
        if (!storeExist) {
            throw new BadRequestException('Mã cửa hàng không đúng')
        }

        const [cratedRating, materials] = await this.prisma.$transaction(async (tx) => {
            return await Promise.all([
                tx.rating.create({
                    data: {
                        id: ratingId,
                        productId,
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
            result: {
                cratedRating,
                materials
            }
        }
    }

    async replyRating(store: CurrentStoreType, body: CreateReplyRatingDTO): Promise<Return> {
        const { userId } = store
        const { detail, ratingId, urls } = body
        const ratingExist = await this.prisma.rating.findUnique({
            where: {
                id: ratingId
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
                        id: ratingId
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
                        ratingId
                    }
                }),
                ...urls.map(({ url, isPrimary = false }) =>
                    tx.ratingMaterial.create({
                        data: {
                            id: uuidv4(),
                            url,
                            isPrimary,
                            ratingId,
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