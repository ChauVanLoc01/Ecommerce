import { PrismaService } from '@app/common/prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { Cache } from 'cache-manager'
import { updateQuantityVoucher } from 'common/constants/event.constant'
import { VoucherType } from 'common/constants/voucher.constant'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { MessageReturn, Return } from 'common/types/result.type'
import { hash } from 'common/utils/helper'
import { CronJob } from 'cron'
import { addHours, addMinutes } from 'date-fns'
import { isUndefined, omitBy } from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { CreateVoucherDTO } from './dtos/CreateVoucher.dto'
import { VoucherQueryDTO } from './dtos/QueryVoucher.dto'
import { UpdateVoucherDTO } from './dtos/UpdateVoucher.dto'
import { SearchCodeDTO } from './dtos/search-code.dto'

@Injectable()
export class VoucherService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
        @Inject('STORE_SERVICE') private storeClient: ClientProxy,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject('SOCKET_SERVICE') private socketClient: ClientProxy,
        private schedulerRegistry: SchedulerRegistry
    ) {}

    async createVoucher(user: CurrentStoreType, body: CreateVoucherDTO): Promise<Return> {
        const exist = await this.prisma.voucher.findMany({
            where: {
                storeId: user.storeId,
                code: body.code,
                endDate: {
                    gte: new Date().toISOString()
                }
            }
        })

        if (exist.length > 0) {
            throw new BadRequestException('Tồn tại 1 mã giảm giá còn hiệu lực với mã code đó')
        }

        const {
            initQuantity,
            maximum,
            percent,
            title,
            type,
            category,
            code,
            description,
            priceMin,
            status,
            totalMin,
            endDate,
            startDate
        } = body

        const createdVoucher = await this.prisma.$transaction(async (tx) => {
            var createdPriceCondition, createdCategoryCondition
            if (totalMin || priceMin) {
                createdPriceCondition = await this.prisma.priceConditionVoucher.create({
                    data: {
                        id: uuidv4(),
                        totalMin,
                        priceMin,
                        createdAt: new Date().toISOString(),
                        createdBy: user.userId
                    }
                })
            }

            if (category) {
                createdCategoryCondition = await this.prisma.categoryConditionVoucher.create({
                    data: {
                        id: uuidv4(),
                        categoryShortName: category,
                        createdAt: new Date().toISOString(),
                        createdBy: user.userId
                    }
                })
            }

            const createdVoucher = await this.prisma.voucher.create({
                data: {
                    id: uuidv4(),
                    code,
                    initQuantity,
                    currentQuantity: initQuantity,
                    startDate,
                    endDate,
                    status,
                    title,
                    type,
                    categoryConditionId: createdCategoryCondition
                        ? createdCategoryCondition.id
                        : undefined,
                    priceConditionId: createdPriceCondition ? createdPriceCondition.id : undefined,
                    description,
                    maximum,
                    percent,
                    storeId: user.storeId,
                    createdBy: user.userId,
                    createdAt: new Date().toISOString()
                }
            })

            return createdVoucher
        })

        return {
            msg: 'ok',
            result: createdVoucher
        }
    }

    async updateVoucher(
        user: CurrentStoreType,
        voucherId: string,
        body: UpdateVoucherDTO
    ): Promise<Return> {
        try {
            const {
                initQuantity,
                maximum,
                percent,
                status,
                title,
                category,
                code,
                description,
                endDate,
                priceMin,
                startDate,
                totalMin
            } = body
            const voucherExist = await this.prisma.voucher.findUnique({
                where: {
                    id: voucherId
                }
            })

            if (!voucherExist) {
                throw new NotFoundException('Mã giảm giá không tồn tại')
            }

            if (voucherExist.currentQuantity !== voucherExist.initQuantity) {
                throw new BadRequestException('Không thể cập nhật mã giảm giá đã sử dụng')
            }

            await this.prisma.voucher.update({
                where: {
                    id: voucherId,
                    storeId: user.storeId
                },
                data: {
                    code,
                    title,
                    maximum,
                    initQuantity,
                    percent,
                    status,
                    description,
                    endDate,
                    startDate,
                    updatedAt: new Date().toISOString(),
                    updatedBy: user.userId,
                    CategoryConditionVoucher: voucherExist?.categoryConditionId
                        ? {
                              update: {
                                  categoryShortName: category,
                                  updatedBy: user.userId,
                                  updatedAt: new Date().toISOString()
                              }
                          }
                        : undefined,
                    PriceConditionVoucher: voucherExist?.priceConditionId
                        ? {
                              update: {
                                  priceMin,
                                  totalMin,
                                  updatedBy: user.userId,
                                  updatedAt: new Date().toISOString()
                              }
                          }
                        : undefined
                }
            })

            return {
                msg: 'ok',
                result: undefined
            }
        } catch (err) {
            console.log('error', err)
            throw new HttpException(
                err.message || 'Lỗi Server',
                err.status || HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getDetail(user: CurrentStoreType, voucherId: string): Promise<Return> {
        const voucherExist = await this.prisma.voucher.findUnique({
            where: {
                id: voucherId,
                storeId: user.storeId
            },
            include: {
                CategoryConditionVoucher: true,
                PriceConditionVoucher: true
            }
        })

        if (!voucherExist) {
            throw new NotFoundException('Mã giảm giá không tồn tại')
        }

        return {
            msg: 'ok',
            result: voucherExist
        }
    }

    async getAllVoucher(user: CurrentStoreType, query: VoucherQueryDTO): Promise<Return> {
        const { storeId } = user
        const { endDate, limit, page, startDate, status, code, createdAt } = query

        const take = limit | this.configService.get('app.limit_default')

        const [length, vouchers] = await Promise.all([
            this.prisma.voucher.count({
                where: {
                    storeId,
                    code: {
                        contains: code
                    },
                    status,
                    startDate: {
                        gte: startDate,
                        lte: endDate
                    },
                    endDate: {
                        lte: endDate,
                        gte: startDate
                    }
                }
            }),
            this.prisma.voucher.findMany({
                where: {
                    storeId,
                    code: {
                        contains: code
                    },
                    status,
                    startDate: {
                        gte: startDate,
                        lte: endDate
                    },
                    endDate: {
                        lte: endDate,
                        gte: startDate
                    }
                },
                orderBy: {
                    createdAt
                },
                take,
                skip: page && page > 1 ? (page - 1) * take : 0
            })
        ])

        return {
            msg: 'ok',
            result: {
                data: vouchers,
                query: omitBy(
                    {
                        ...query,
                        page: page || 1,
                        page_size: Math.ceil(length / take)
                    },
                    isUndefined
                )
            }
        }
    }

    async voucherAnalytics(user: CurrentStoreType): Promise<Return> {
        const { storeId } = user
        const [all, active, block] = await Promise.all([
            this.prisma.voucher.count({
                where: {
                    storeId
                }
            }),
            this.prisma.voucher.count({
                where: {
                    storeId,
                    status: 'ACTIVE'
                }
            }),
            this.prisma.voucher.count({
                where: {
                    storeId,
                    status: 'BLOCK'
                }
            })
        ])
        return {
            msg: 'ok',
            result: {
                all,
                active,
                block
            }
        }
    }

    async getUserVoucherByStore(user: CurrentUserType, storeId: string): Promise<Return> {
        const vouchersValid = await this.prisma.voucher.findMany({
            where: {
                storeId,
                status: Status.ACTIVE,
                currentQuantity: {
                    gte: 1
                },
                type: VoucherType.store,
                endDate: {
                    gt: addMinutes(addHours(new Date(), 7), 1)
                }
            },
            include: {
                CategoryConditionVoucher: true,
                PriceConditionVoucher: true
            }
        })

        return {
            msg: 'ok',
            result: vouchersValid
        }
    }

    async getUserVoucherByGlobal(user: CurrentUserType): Promise<Return> {
        const userVouchers = await this.prisma.userVoucher.findMany({
            where: {
                userId: user.id
            }
        })

        const vouchersValid = await Promise.all(
            userVouchers.map((voucher) =>
                this.prisma.voucher.findUnique({
                    where: {
                        id: voucher.voucherId,
                        status: Status.ACTIVE,
                        currentQuantity: {
                            gte: 1
                        },
                        type: VoucherType.global
                    },
                    include: {
                        CategoryConditionVoucher: true,
                        PriceConditionVoucher: true
                    }
                })
            )
        )

        return {
            msg: 'ok',
            result: vouchersValid
        }
    }

    async searchVoucherByCode(body: SearchCodeDTO): Promise<Return> {
        try {
            const { code, storesID } = body
            const vouchers = (
                await Promise.all(
                    storesID.map((storeId) =>
                        this.prisma.voucher.findFirst({
                            where: {
                                storeId,
                                code,
                                status: {
                                    in: [Status.ACTIVE, Status.HIDDEN]
                                },
                                endDate: {
                                    gt: addMinutes(addHours(new Date(), 7), 1)
                                }
                            }
                        })
                    )
                )
            ).filter((e) => e)

            if (!vouchers.length) {
                return {
                    msg: 'ok',
                    result: false
                }
            }

            return {
                msg: 'ok',
                result: vouchers
            }
        } catch (err) {
            throw new InternalServerErrorException('Lỗi BE')
        }
    }

    async emitUpdateQuantityVoucher(voucherId: string, storeId: string, quantity: number) {
        this.socketClient.emit(updateQuantityVoucher, {
            voucherId,
            storeId,
            quantity
        })
    }

    async checkVoucherExistToCreateOrder(body: string[][]): Promise<MessageReturn> {
        try {
            await Promise.all(body.map((ids) => this.updateQuantityVoucher(ids[0], ids[1])))
            return {
                msg: 'ok',
                action: true,
                result: null
            }
        } catch (err) {
            console.log('err voucher', err)
            return {
                msg: (err as Error).message,
                action: false,
                result: null
            }
        }
    }

    async updateQuantityVoucher(storeId: string, id: string) {
        const hashValue = hash('voucher', id)

        let fromCache = await this.cacheManager.get<string>(hashValue)

        if (fromCache) {
            let quantityVoucher = +fromCache
            if (quantityVoucher === 1) {
                await Promise.all([
                    this.cacheManager.set(hashValue, 0),
                    this.prisma.voucher.update({
                        where: {
                            id
                        },
                        data: {
                            currentQuantity: 0
                        }
                    })
                ])
                this.emitUpdateQuantityVoucher(id, storeId, 0)
                this.schedulerRegistry.deleteCronJob(hashValue)
            } else {
                let remainingQuantity = quantityVoucher - 1
                await this.cacheManager.set(hashValue, remainingQuantity)
                this.emitUpdateQuantityVoucher(id, storeId, remainingQuantity)
            }
            return {
                msg: 'ok',
                action: true,
                result: null
            }
        }

        const voucherExist = await this.prisma.voucher.findUnique({
            where: {
                id,
                status: {
                    not: Status.BLOCK
                }
            }
        })

        if (!voucherExist || !voucherExist.currentQuantity) {
            await this.cacheManager.set(hashValue, 0)
            throw new Error('Voucher không tồn tại hoặc đã hết')
        }

        if (voucherExist.currentQuantity === 1) {
            await Promise.all([
                this.cacheManager.set(hashValue, 0),
                this.prisma.voucher.update({
                    where: {
                        id
                    },
                    data: {
                        currentQuantity: 0
                    }
                })
            ])
            this.emitUpdateQuantityVoucher(id, voucherExist.storeId, 0)

            return {
                msg: 'ok',
                action: true,
                result: null
            }
        }

        let remainingQuantity = voucherExist.currentQuantity - 1

        await this.cacheManager.set(hashValue, remainingQuantity)

        this.emitUpdateQuantityVoucher(id, voucherExist.storeId, remainingQuantity)

        const cronJob = new CronJob(CronExpression.EVERY_5_MINUTES, async () => {
            const [currentQuantity, voucherExist] = await Promise.all([
                this.cacheManager.get(hashValue),
                this.prisma.voucher.findUnique({
                    where: {
                        id
                    }
                })
            ])

            await this.prisma.voucher.update({
                where: {
                    id
                },
                data: {
                    currentQuantity: +currentQuantity
                }
            })

            if (voucherExist.currentQuantity == currentQuantity) {
                await this.cacheManager.del(hashValue)
                this.schedulerRegistry.deleteCronJob(hashValue)
                return
            }
        })

        this.schedulerRegistry.addCronJob(hashValue, cronJob)

        cronJob.start()

        return {
            msg: 'ok',
            action: true,
            result: null
        }
    }

    async updateVoucherWhenCancelOrder(orderId: string, storeId: string): Promise<MessageReturn> {
        try {
            const voucherOrders = await this.prisma.orderVoucher.findMany({
                where: {
                    orderId
                }
            })

            if (!voucherOrders.length) {
                return {
                    msg: 'Đơn hàng không có sử dụng voucher',
                    action: true,
                    result: null
                }
            }

            await Promise.all(
                voucherOrders.map(async ({ voucherId }) => {
                    let hashValue = hash('voucher', voucherId)
                    let fromCache = await this.cacheManager.get<number>(hashValue)

                    if (fromCache || fromCache == 0) {
                        this.emitUpdateQuantityVoucher(voucherId, storeId, fromCache + 1)
                        return Promise.resolve<MessageReturn>({
                            msg: 'ok',
                            action: true,
                            result: null
                        })
                    }

                    const voucherExist = await this.prisma.voucher.findUnique({
                        where: {
                            id: voucherId
                        }
                    })

                    if (!voucherExist) {
                        return Promise.reject<MessageReturn>({
                            msg: 'Voucher không tồn tại',
                            action: false,
                            result: null
                        })
                    }

                    return this.prisma.voucher.update({
                        where: {
                            id: voucherId
                        },
                        data: {
                            currentQuantity: {
                                increment: 1
                            }
                        }
                    })
                })
            )

            return {
                msg: 'ok',
                action: true,
                result: null
            }
        } catch (err) {
            return {
                msg: err?.message || 'Cập nhật số lương cho voucher không thành công',
                action: false,
                result: null
            }
        }
    }
}
