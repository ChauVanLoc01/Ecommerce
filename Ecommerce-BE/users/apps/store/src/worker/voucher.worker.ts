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

@Processor(BackgroundName.voucher)
export class VoucherConsummer {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
        private schedulerRegistry: SchedulerRegistry,
        private readonly prisma: PrismaService
    ) {}

    @Process(BackgroundAction.resetValueVoucherWHenUpdateProductFail)
    async resetQuantityVoucherInCache({ data }: Job<string[]>) {
        console.log('::::::::::::Tiến hành rollback voucher:::::::::::::')
        try {
            await Promise.all(
                data.map(async (id) => {
                    let hashValue = hash('voucher', id)
                    let fromCache = await this.cacheManager.get<string>(hashValue)
                    if (fromCache) {
                        let { quantity, times } = JSON.parse(fromCache) as {
                            quantity: number
                            times: number
                        }
                        return this.cacheManager.set(
                            hashValue,
                            JSON.stringify({ quantity: quantity + 1, times })
                        )
                    }
                    throw new Error('Lỗi câp nhật voucher')
                })
            )
            await new Promise(() => {
                console.log(
                    '::::::::::::::Success: Roll back số lượng voucher về lại ban đầu::::::::::'
                )
            })
        } catch (err) {
            console.log('***********Fail: Lỗi cập nhật lại cache khi voucher fail************', err)
            throw new Error('Lỗi cập nhật voucher')
        }
    }

    @Process(BackgroundAction.createCronJobVoucherToUpdateQuanttiy)
    async createCronJobToUpdateVoucher({ data }: Job<string[]>) {
        console.log('::::::::::Tạo cron job để cập nhật số lượng voucher::::::::::::')
        try {
            data.forEach((voucherId) => {
                let hashValue = hash('voucher', voucherId)
                let isExist = this.schedulerRegistry.doesExist('cron', hashValue)
                if (isExist) {
                    console.log(
                        `:::::::::::Cron job cập nhật số lượng voucher [${voucherId}]::::::::::::::`
                    )
                } else {
                    let cron_job = new CronJob(CronExpression.EVERY_MINUTE, async () => {
                        try {
                            let fromCache = await this.cacheManager.get<string>(hashValue)
                            if (fromCache) {
                                let { quantity: quantityFromCache, times } = JSON.parse(
                                    fromCache
                                ) as { quantity: number; times: number }
                                console.log(
                                    `::::::::::::::Lần cập nhật voucher thứ ${times}::::::::::Số lượng [${quantityFromCache}]:::::::::::`
                                )
                                const result = await Promise.all([
                                    this.prisma.voucher.update({
                                        where: {
                                            id: voucherId
                                        },
                                        data: {
                                            currentQuantity: quantityFromCache,
                                            updatedAt: new Date()
                                        }
                                    }),
                                    this.cacheManager.set(
                                        hashValue,
                                        JSON.stringify({
                                            quantity: quantityFromCache,
                                            times: times - 1
                                        })
                                    )
                                ])
                                if (result && times == 1) {
                                    console.log(
                                        '::::::::::::Times = 1 ==> Voucher: Xóa Cron Job và clear Cache:::::::::::::::'
                                    )
                                    let cron_job = this.schedulerRegistry.getCronJob(hashValue)
                                    cron_job.stop()
                                    this.schedulerRegistry.deleteCronJob(hashValue)
                                    await this.cacheManager.del(hashValue)
                                }
                            }
                        } catch (err) {
                            console.log('Lỗi chạy cron job cập nhật voucher')
                        }
                    })
                    this.schedulerRegistry.addCronJob(hashValue, cron_job)
                    cron_job.start()
                }
            })
        } catch (err) {
            console.log('Lỗi cập nhật lại cache khi voucher fail', err)
            throw new Error('Lỗi tạo cron job voucher')
        }
    }
}
