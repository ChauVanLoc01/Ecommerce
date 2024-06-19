import { PrismaService } from '@app/common/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { Cron, SchedulerRegistry } from '@nestjs/schedule'
import { SalePromotion } from 'common/constants/sale-promotion.constant'
import { Status } from 'common/enums/status.enum'
import { CronJob } from 'cron'
import { add, eachHourOfInterval, endOfDay, format, nextMonday, startOfDay } from 'date-fns'
import { chunk } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ScheduleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly scheduleRegister: SchedulerRegistry
    ) {}

    calDate() {
        const nextMon = startOfDay(nextMonday(new Date()))
        const nextMontoTo7Days = endOfDay(add(nextMon, { days: 6 }))
        const duration = eachHourOfInterval({ start: nextMon, end: nextMontoTo7Days })

        return duration
    }

    @Cron('1 30 3 * * 1', {
        name: 'auto creating sale promotion'
    })
    async autoCreatingSalePromotion() {
        chunk(this.calDate(), 24).map((dates, idx) =>
            this.createSalePromotion(uuidv4(), 5 * idx, dates)
        )
    }

    async createSalePromotion(name: string, second: number, data: Date[]) {
        const cron_job = new CronJob(`${second} 31 3 * * 1`, async () => {
            await Promise.all(
                data.map((date) => {
                    let formatDate = format(date, 'HH:mm dd-MM-yyyy')
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
                            createdBy: 'auto'
                        }
                    })
                })
            )
        })

        this.scheduleRegister.addCronJob(name, cron_job)

        cron_job.start()
    }
}
