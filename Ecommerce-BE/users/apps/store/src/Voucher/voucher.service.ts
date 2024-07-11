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
import { SchedulerRegistry } from '@nestjs/schedule'
import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { Cache } from 'cache-manager'
import {
    commitUpdateQuantityProducts,
    rollbackUpdateQuantityProducts,
    statusOfOrder,
    updateQuantityVoucher
} from 'common/constants/event.constant'
import { VoucherType } from 'common/constants/voucher.constant'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { OrderPayload } from 'common/types/order_payload.type'
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
        @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
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
                include: {
                    CategoryConditionVoucher: true,
                    PriceConditionVoucher: true
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

    async emitUpdateQuantityVoucherToSocket(voucherId: string, storeId: string, quantity: number) {
        console.log('emit quantity voucher')
        await this.cacheManager.set(
            hash('voucher', voucherId),
            JSON.stringify({ quantity, times: 3 })
        )
        this.socketClient.emit(updateQuantityVoucher, {
            voucherId,
            storeId,
            quantity
        })
    }

    async commitCreateOrderSuccess(actionId: string, productActionId: string) {
        this.productClient.emit(commitUpdateQuantityProducts, { actionId, productActionId })
    }

    async rollbackCreateOrderFail(actionId: string, productActionId: string) {
        this.productClient.emit(rollbackUpdateQuantityProducts, { actionId, productActionId })
    }

    async checkVoucherExistToCreateOrder(body: OrderPayload & { productActionId: string }) {
        let tmp: { voucherId: string; quantity: number; storeId: string }[] = []

        this.prisma
            .$transaction(async (tx) => {
                try {
                    for (let { voucherId, storeId } of body.body.orders) {
                        if (!voucherId) {
                            return
                        }
                        let hashValue = hash('voucher', voucherId)
                        let quantityFromCache = await this.cacheManager.get<number>(hashValue)
                        let quantityTmp = 0

                        if (quantityFromCache) {
                            if (quantityFromCache == 1) {
                                await tx.voucher.update({
                                    where: {
                                        id: voucherId
                                    },
                                    data: {
                                        currentQuantity: 0
                                    }
                                })
                            }
                            quantityTmp = quantityFromCache - 1
                        } else {
                            const voucherExist = await tx.voucher.findUnique({
                                where: {
                                    id: voucherId,
                                    status: Status.ACTIVE,
                                    endDate: {
                                        gte: new Date()
                                    }
                                }
                            })
                            console.log('voucherExist', voucherExist)
                            if (!voucherExist) {
                                throw new Error('Voucher không tồn tại')
                            }
                            if (voucherExist.currentQuantity == 0) {
                                throw new Error('Voucher đã hết lượt sử dụng')
                            }

                            if (voucherExist.currentQuantity == 1) {
                                await tx.voucher.update({
                                    where: {
                                        id: voucherId
                                    },
                                    data: {
                                        currentQuantity: 0
                                    }
                                })
                            }
                            quantityTmp = voucherExist.currentQuantity - 1
                            let hashValue = hash('voucher', voucherId)
                            let cron_job = new CronJob(hashValue, async () => {
                                try {
                                    let fromCache = await this.cacheManager.get<string>(hashValue)
                                    if (fromCache) {
                                        let { quantity: quantityFromCache, times } = JSON.parse(
                                            fromCache
                                        ) as { quantity: number; times: number }
                                        let cron_job = this.schedulerRegistry.getCronJob(hashValue)
                                        if (times == 0) {
                                            cron_job.stop()
                                            this.schedulerRegistry.deleteCronJob(hashValue)
                                            return
                                        }
                                        await Promise.all([
                                            this.cacheManager.set(hashValue, {
                                                quantity: quantityFromCache,
                                                times: times - 1
                                            }),
                                            this.prisma.voucher.update({
                                                where: {
                                                    id: voucherId
                                                },
                                                data: {
                                                    currentQuantity: quantityFromCache
                                                }
                                            })
                                        ])
                                    }
                                } catch (err) {
                                    console.log('error line 545', err)
                                }
                            })
                            this.schedulerRegistry.addCronJob(hashValue, cron_job)
                            cron_job.start()
                        }
                        tmp.push({ storeId, quantity: quantityTmp, voucherId })
                    }
                } catch (err) {
                    console.log('error line 554', err)
                }
            })
            .then(async () => {
                this.commitCreateOrderSuccess(body.body.actionId, body.productActionId)
                this.socketClient.emit(statusOfOrder, {
                    id: body.body.actionId,
                    msg: 'Đặt hàng thành công',
                    action: true,
                    result: body.body.actionId
                })
                await Promise.all(
                    tmp.map(({ quantity, storeId, voucherId }) =>
                        this.emitUpdateQuantityVoucherToSocket(voucherId, storeId, quantity)
                    )
                )
            })
            .catch(async (err) => {
                console.log('error ine 572', err)
                this.socketClient.emit(statusOfOrder, {
                    id: body.body.actionId,
                    msg: 'Lỗi cập nhật voucher',
                    action: false,
                    result: null
                })
                this.rollbackCreateOrderFail(body.body.actionId, body.productActionId)
                tmp.forEach(({ voucherId }) => {
                    let hashValue = hash('voucher', voucherId)
                    let cron_job = this.schedulerRegistry.getCronJob(hashValue)
                    if (cron_job) {
                        cron_job.stop()
                        this.schedulerRegistry.deleteCronJob(hashValue)
                    }
                })
            })
    }

    async updateVoucherWhenCancelOrder(payload: {
        storeId: string
        voucherIds: string[]
    }): Promise<MessageReturn> {
        let { storeId, voucherIds } = payload

        try {
            await this.prisma.$transaction(async (tx) => {
                try {
                    voucherIds.forEach(async (voucherId) => {
                        let hashValue = hash('voucher', voucherId)
                        let fromCache = await this.cacheManager.get<string>(hashValue)

                        if (fromCache) {
                            let { quantity } = JSON.parse(fromCache) as {
                                quantity: number
                                times: number
                            }
                            await this.emitUpdateQuantityVoucherToSocket(
                                voucherId,
                                storeId,
                                quantity + 1
                            )
                            return
                        }
                        const voucherExist = await tx.voucher.findUnique({
                            where: {
                                id: voucherId
                            }
                        })

                        if (!voucherExist) {
                            throw new Error('Voucher không tồn tại')
                        }

                        await tx.voucher.update({
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
                } catch (err) {
                    throw new Error('Lỗi cập nhật voucher')
                }
            })
            return {
                msg: 'ok',
                action: true,
                result: null
            }
        } catch (err) {
            await this.rollbackUpdateVoucherWhenCancelOrdere(payload)
            return {
                msg: err?.message || 'Lỗi cập nhật số lượng voucher',
                action: false,
                result: null
            }
        }
    }

    async rollbackUpdateVoucherWhenCancelOrdere(payload: {
        storeId: string
        voucherIds: string[]
    }) {
        let { storeId, voucherIds } = payload
        console.log('rollback voucher')
        let rollback = async (voucherId: string) => {
            let hashValue = hash('voucher', voucherId)
            let fromCache = await this.cacheManager.get<string>(hashValue)

            if (fromCache) {
                let { quantity } = JSON.parse(fromCache) as { quantity: number }
                await this.emitUpdateQuantityVoucherToSocket(voucherId, storeId, quantity - 1)
            }
            return {
                msg: 'ok',
                action: true,
                result: null
            }
        }

        try {
            await Promise.all(voucherIds.map((voucherId) => rollback(voucherId)))
        } catch (err) {
            console.log('error', err)
        }
    }
}
