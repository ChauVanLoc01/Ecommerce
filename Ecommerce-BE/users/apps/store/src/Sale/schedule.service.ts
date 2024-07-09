import { PrismaService } from '@app/common/prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { Cache } from 'cache-manager'
import { currentSalePromotion } from 'common/constants/event.constant'
import { SalePromotion } from 'common/constants/sale-promotion.constant'
import { Status } from 'common/enums/status.enum'
import { CronJob } from 'cron'
import {
    add,
    eachHourOfInterval,
    endOfDay,
    endOfHour,
    format,
    nextSunday,
    previousMonday,
    setDefaultOptions,
    startOfDay,
    startOfHour,
    sub
} from 'date-fns'
import { vi } from 'date-fns/locale'
import { chunk } from 'lodash'
import { v4 as uuidv4 } from 'uuid'

setDefaultOptions({ locale: vi })

@Injectable()
export class ScheduleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly scheduleRegister: SchedulerRegistry,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    calDate() {
        let start = add(startOfDay(previousMonday(new Date())), { hours: 7 })
        let end = add(endOfDay(nextSunday(new Date())), { hours: 7 })
        return eachHourOfInterval({ start, end })
    }

    @Cron('1 30 3 * * 1', {
        name: 'auto creating sale promotion'
    })
    async autoCreatingSalePromotion() {
        let tmp = this.calDate()
        chunk(tmp, 24).map((dates, idx) => this.createSalePromotion(uuidv4(), 5 * idx, dates))
    }

    async createSalePromotion(name: string, second: number, data: Date[]) {
        const cron_job = new CronJob(`${second} 31 3 * * 1`, async () => {
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
        let currentDate = add(startOfHour(new Date()), { hours: 7 }).toISOString()
        let lastOfHour = add(endOfHour(new Date()), { hours: 7 }).toISOString()

        let process = async (
            tx: Omit<
                PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
                '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
            >
        ) => {
            const current = await tx.salePromotion.findFirst({
                where: {
                    startDate: {
                        gte: currentDate
                    },
                    endDate: {
                        lte: lastOfHour
                    }
                },
                select: {
                    id: true
                }
            })

            if (!current) {
                throw new Error('Event hiện tại không tồn tại')
            }

            await Promise.all([
                this.cacheManager.set(currentSalePromotion, current.id),
                tx.salePromotion.update({
                    where: {
                        id: current.id
                    },
                    data: {
                        status: Status.ACTIVE,
                        updatedAt: new Date(),
                        updatedBy: 'system'
                    }
                })
            ])
        }

        let currentSaleId = await this.cacheManager.get<string>(currentSalePromotion)

        if (currentSaleId) {
            await this.prisma.$transaction(async (tx) => {
                await tx.salePromotion.update({
                    where: {
                        id: currentSaleId
                    },
                    data: {
                        status: Status.BLOCK,
                        updatedAt: new Date(),
                        updatedBy: 'system'
                    }
                })
                await process(tx)
            })
            return
        }
        await this.prisma.$transaction(async (tx) => {
            let preDate = add(startOfHour(new Date()), { hours: 6 }).toISOString()
            let preLastDate = add(endOfHour(new Date()), { hours: 7 }).toISOString()
            const preEvent = await tx.salePromotion.findFirst({
                where: {
                    startDate: {
                        gte: preDate
                    },
                    endDate: {
                        lte: preLastDate
                    }
                },
                select: {
                    id: true
                }
            })
            if (preEvent) {
                await tx.salePromotion.update({
                    where: {
                        id: preEvent.id
                    },
                    data: {
                        status: Status.BLOCK
                    }
                })
            }
            await process(tx)
        })
    }
}
