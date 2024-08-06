import { PrismaService } from '@app/common/prisma/prisma.service'
import { Process, Processor } from '@nestjs/bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject } from '@nestjs/common/decorators'
import { ConfigService } from '@nestjs/config'
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { Job } from 'bull'
import { Cache } from 'cache-manager'
import { BackgroundAction, BackgroundName } from 'common/constants/background-job.constant'
import { hash } from 'common/utils/order_helper'
import { CronJob } from 'cron'

@Processor(BackgroundName.product_sale)
export class ProductSaleConsummer {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
        private schedulerRegistry: SchedulerRegistry,
        private readonly prisma: PrismaService
    ) {}

    @Process(BackgroundAction.createCronJobToUpdateProductSale)
    async createCronJobToUpdateProductSale(job: Job<string[]>) {
        try {
            console.log(
                '::::::::Background job: Tiến hành tạo cron job để cập nhật số lượng product sale từ cache::::::::::'
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
                            ':::::::::Background job: Tạo cron job để cập nhật product sale:::::::::::'
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
                                            `:::::::Lần chạy cron job thứ ${times} - số lượng cập nhật product sale ${quantity}::::::::::`
                                        )
                                        let productSaleExist =
                                            await this.prisma.productPromotion.findUnique({
                                                where: {
                                                    id: productId
                                                },
                                                select: {
                                                    quantity: true
                                                }
                                            })
                                        await Promise.all([
                                            this.prisma.productPromotion.update({
                                                where: {
                                                    id: productId
                                                },
                                                data: {
                                                    currentQuantity: quantity,
                                                    bought: productSaleExist.quantity - quantity
                                                }
                                            }),
                                            this.cacheManager.set(
                                                hashValue,
                                                JSON.stringify({ quantity, times: times - 1 })
                                            )
                                        ])
                                        console.log('::::::::::Đã cập nhật xong:::::::::')
                                        if (times == 1) {
                                            console.log(
                                                ':::::::::::::Xoá cron job product sale::::::::::::::'
                                            )
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
                '**********Có lõi trong quá trình tạo cron job để cập nhật product sale**********',
                err
            )
            throw new Error('Tạo cron job cho product thất bại')
        }
    }
}
