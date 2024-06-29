import { PrismaService } from '@app/common/prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { Cache } from 'cache-manager'
import { currentSalePromotion } from 'common/constants/event.constant'
import { SalePromotion } from 'common/constants/sale-promotion.constant'
import { Status } from 'common/enums/status.enum'
import { CronJob } from 'cron'
import { add, eachHourOfInterval, endOfWeek, format, startOfHour, startOfWeek, sub } from 'date-fns'
import { chunk } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ScheduleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly scheduleRegister: SchedulerRegistry,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    calDate() {
        return eachHourOfInterval({ start: startOfWeek(new Date()), end: endOfWeek(new Date()) })
    }

    @Cron('1 46 * * * *', {
        name: 'auto creating sale promotion'
    })
    async autoCreatingSalePromotion() {
        chunk(this.calDate(), 24).map((dates, idx) =>
            this.createSalePromotion(uuidv4(), 5 * idx, dates)
        )
    }

    async createSalePromotion(name: string, second: number, data: Date[]) {
        const cron_job = new CronJob(`${second} 47 * * * *`, async () => {
            await Promise.all(
                data.map((date) => {
                    let formatDate = format(sub(date, { hours: 7 }), 'HH:mm dd-MM-yyyy')
                    return this.prisma.salePromotion.create({
                        data: {
                            id: uuidv4(),
                            title: `Daily Sale ${formatDate}`,
                            description: `Chương trình giảm giá hằng ngày kích cầu mua sắm ${formatDate}`,
                            startDate: date,
                            endDate: add(date, { hours: 1 }),
                            createdAt: new Date(),
                            status: Status.BLOCK,
                            type: SalePromotion.NORMAL,
                            createdBy: 'system'
                        }
                    })
                })
            )
        })

        this.scheduleRegister.addCronJob(name, cron_job)

        cron_job.start()

        console.log('ok')
    }

    @Cron(CronExpression.EVERY_HOUR)
    async setCurrentSalePromotion() {
        let currentDate = startOfHour(new Date()).toISOString()

        let preDate = startOfHour(sub(new Date(), { hours: 12 })).toISOString()

        let currentSaleId = await this.cacheManager.get<string>(currentSalePromotion)

        if (currentSaleId && preDate === currentSaleId) {
            const saleExist = await this.prisma.salePromotion.findUnique({
                where: {
                    id: currentSaleId
                }
            })

            if (saleExist) {
                await Promise.all([
                    this.prisma.salePromotion.update({
                        where: {
                            id: currentSaleId
                        },
                        data: {
                            status: Status.BLOCK,
                            updatedAt: new Date(),
                            updatedBy: 'system'
                        }
                    }),
                    this.prisma.salePromotion.update({
                        where: {
                            id: currentDate
                        },
                        data: {
                            status: Status.ACTIVE,
                            updatedAt: new Date(),
                            updatedBy: 'system'
                        }
                    })
                ])
            }
        }
        await this.cacheManager.set(currentSalePromotion, currentDate)
    }
}
