import { PrismaService } from '@app/common/prisma/prisma.service'
import { Process, Processor } from '@nestjs/bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InternalServerErrorException } from '@nestjs/common'
import { Inject } from '@nestjs/common/decorators'
import { ConfigService } from '@nestjs/config'
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { Prisma } from '@prisma/client'
import { Job } from 'bull'
import { Cache } from 'cache-manager'
import { BackgroundAction, BackgroundName } from 'common/constants/background-job.constant'
import { RollbackOrder } from 'common/types/order_payload.type'
import { hash } from 'common/utils/order_helper'
import { CronJob } from 'cron'

@Processor(BackgroundName.product)
export class ProductConsummer {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
        private schedulerRegistry: SchedulerRegistry,
        private readonly prisma: PrismaService
    ) {}

    @Process(BackgroundAction.resetValueCacheWhenUpdateProductFail)
    async resetValueCacheProduct(
        job: Job<
            Pick<RollbackOrder['products'][number], 'id' | 'price_after' | 'original_quantity'>[]
        >
    ) {
        try {
            console.log(
                ':::::::::::::Đơn hàng thất bại ==> roll back lại số lượng ban đầu của sản phẩm::::::::::::'
            )
            await Promise.all(
                job.data.map(({ id, price_after, original_quantity }) => {
                    let hashValue = hash('product', id)
                    return this.cacheManager.set(
                        hashValue,
                        JSON.stringify({
                            quantity: original_quantity,
                            priceAfter: price_after,
                            times: 3
                        })
                    )
                })
            )
            console.log(':::::::::Success: Roll back lại số lượng sản phẩm thành công:::::::::::')
        } catch (err) {
            console.log('*******Fail: Roll back lại số lượng ban đầu của', err)
            throw new Error('Lỗi cập nhật lại số lượng product')
        }
    }

    @Process(BackgroundAction.createCronJobToUpdateProduct)
    async createCronJobToUpdateProductQuantity(job: Job<string[]>) {
        try {
            console.log(
                '::::::::Background job: Tiến hành tạo cron job để cập nhật số lượng sản phẩm từ cache::::::::::'
            )
            await Promise.all(
                job.data.map(async (productId) => {
                    let hashValue = hash('product', productId)
                    let fromCache = await this.cacheManager.get<string>(hashValue)
                    let isExistCronJob = this.schedulerRegistry.doesExist('cron', hashValue)
                    if (isExistCronJob && fromCache) {
                        console.log(
                            '::::::::Background Job: Cron Job đã tồn tại ==> Không tạo cron job:::::::::',
                            hashValue
                        )
                        let { quantity, priceAfter } = JSON.parse(fromCache) as {
                            quantity: number
                            priceAfter: number
                        }
                        this.cacheManager.set(
                            hashValue,
                            JSON.stringify({ quantity, priceAfter, times: 3 })
                        )
                        return true
                    } else {
                        console.log(
                            ':::::::::Background job: Tạo cron job để cập nhật product:::::::::::'
                        )
                        const update_product_cron_job = new CronJob(
                            CronExpression.EVERY_30_SECONDS,
                            async () => {
                                try {
                                    let fromCache = await this.cacheManager.get<string>(hashValue)
                                    if (fromCache) {
                                        let { quantity, times } = JSON.parse(fromCache) as {
                                            quantity: number
                                            times: number
                                        }
                                        console.log(
                                            `:::::::Lần chạy cron job thứ ${times} - số lượng cập nhật ${quantity}::::::::::`
                                        )
                                        await Promise.all([
                                            this.prisma.product.update({
                                                where: {
                                                    id: productId
                                                },
                                                data: {
                                                    currentQuantity: quantity
                                                }
                                            }),
                                            this.cacheManager.set(
                                                hashValue,
                                                JSON.stringify({ quantity, times: times - 1 })
                                            )
                                        ])
                                        console.log('::::::::::Đã cập nhật xong:::::::::')
                                        if (times == 1) {
                                            console.log(':::::::::::::Xoá cron job::::::::::::::')
                                            this.schedulerRegistry.deleteCronJob(hashValue)
                                            this.cacheManager.del(hashValue)
                                            return
                                        }
                                    }
                                } catch (err) {
                                    console.log(
                                        ':::::::::Lỗi chạy cron job cập nhật số lượng sản phẩm:::::::::',
                                        err
                                    )
                                }
                            }
                        )
                        this.schedulerRegistry.addCronJob(hashValue, update_product_cron_job)
                        update_product_cron_job.start()
                        return true
                    }
                })
            )
        } catch (err) {
            console.log(
                '**********Có lõi trong quá trình tạo cron job để cập nhật product**********',
                err
            )
            throw new Error('Tạo cron job cho product thất bại')
        }
    }

    @Process(BackgroundAction.rollbackAddingProductToSale)
    async rollbackAddingProductToSale(
        job: Job<{ userId: string; body: { quantity: number; productId: string }[] }>
    ) {
        let { body, userId } = job.data
        try {
            await this.prisma.$transaction(async (tx) => {
                await Promise.all(
                    body.map((product) => {
                        return tx.product.update({
                            where: {
                                id: product.productId
                            },
                            data: {
                                currentQuantity: {
                                    increment: product.quantity
                                },
                                updatedAt: new Date(),
                                updatedBy: userId
                            }
                        })
                    })
                )
            })
        } catch (err) {
            throw new InternalServerErrorException('Roll back sản phẩm khi tạo sale gặp lỗi')
        }
    }

    @Process(BackgroundAction.rollbackUpdatingProductToSale)
    async rollbackUpdatingProductToSale(
        job: Job<{ userId: string; body: { quantity: number; productId: string }[] }>
    ) {
        let { body, userId } = job.data
        try {
            await this.prisma.$transaction(async (tx) => {
                await Promise.all(
                    body.map((data) => {
                        let { productId, quantity } = data
                        let isGt0 = quantity > 0
                        let currentQuantity: Prisma.ProductUpdateInput['currentQuantity'] = isGt0
                            ? {
                                  decrement: data.quantity
                              }
                            : {
                                  increment: data.quantity
                              }
                        return tx.product.update({
                            where: {
                                id: productId
                            },
                            data: {
                                currentQuantity,
                                updatedAt: new Date(),
                                updatedBy: userId
                            }
                        })
                    })
                )
            })
        } catch (err) {
            throw new InternalServerErrorException('Rollback lại product sale gặp lỗi')
        }
    }
}
