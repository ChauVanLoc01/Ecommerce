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
        } catch (err) {
            console.log('*******Lỗi reset lại value cache khi cập nhật voucher thất bại', err)
            throw new Error('Lỗi cập nhật lại số lượng product')
        }
    }

    @Process(BackgroundAction.createCronJobToUpdateProduct)
    async createCronJobToUpdateProductQuantity(job: Job<string[]>) {
        try {
            console.log('create cron job')
            job.data.forEach((productId) => {
                let hashValue = hash('product', productId)
                let isExistCronJob = this.schedulerRegistry.doesExist('cron', hashValue)
                if (isExistCronJob) {
                    console.log('Đã tồn tại cron job::::', hashValue)
                    return
                }
                const update_product_cron_job = new CronJob(
                    CronExpression.EVERY_5_MINUTES,
                    async () => {
                        let fromCache = await this.cacheManager.get<string>(hashValue)
                        if (fromCache) {
                            let { quantity, times } = JSON.parse(fromCache) as {
                                quantity: number
                                times: number
                            }
                            if (times == 0) {
                                this.schedulerRegistry.deleteCronJob(hashValue)
                                this.cacheManager.del(hashValue)
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
                        }
                    }
                )
                this.schedulerRegistry.addCronJob(hashValue, update_product_cron_job)
                update_product_cron_job.start()
            })
        } catch (err) {
            console.log('*******Có lõi trong quá trình tạo cron job để cập nhật product', err)
            throw new Error('Tạo cron job cho product thất bại')
        }
    }
}
