import { PrismaService } from '@app/common/prisma/prisma.service'
import { Process, Processor } from '@nestjs/bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject } from '@nestjs/common/decorators'
import { ConfigService } from '@nestjs/config'
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule'
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
                    console.log('cron job')
                    if (isExistCronJob && fromCache) {
                        console.log(
                            '::::::::Background Job: Cron Job đã tồn tại ==> Không tạo cron job:::::::::',
                            hashValue
                        )
                        let { quantity } = JSON.parse(fromCache) as {
                            quantity: number
                        }
                        this.cacheManager.set(hashValue, JSON.stringify({ quantity, times: 3 }))
                        return true
                    } else {
                        console.log(
                            ':::::::::Background job: Tạo cron job để cập nhật product:::::::::::'
                        )
                        const update_product_cron_job = new CronJob(
                            CronExpression.EVERY_5_MINUTES,
                            async () => {
                                try {
                                    if (fromCache) {
                                        let { quantity, times } = JSON.parse(fromCache) as {
                                            quantity: number
                                            times: number
                                        }
                                        console.log(
                                            `:::::::Lần chạy cron job thứ ${times} - số lượng cập nhật ${quantity}::::::::::`
                                        )
                                        if (times == 0) {
                                            this.schedulerRegistry.getCronJob(hashValue).stop()
                                            this.schedulerRegistry.deleteCronJob(hashValue)
                                            this.cacheManager.del(hashValue)
                                            return
                                        }
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
}
