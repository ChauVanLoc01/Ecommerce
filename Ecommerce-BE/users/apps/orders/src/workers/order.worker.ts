import { PrismaService } from '@app/common/prisma/prisma.service'
import { OnQueueActive, Process, Processor } from '@nestjs/bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject } from '@nestjs/common/decorators'
import { ClientProxy } from '@nestjs/microservices'
import { Job } from 'bull'
import { Cache } from 'cache-manager'
import { BackgroundAction, BackgroundName } from 'common/constants/background-job.constant'
import { emit_update_Order_WhenCreatingOrder_fn } from 'common/utils/order_helper'

@Processor(BackgroundName.order)
export class ProductConsummer {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly prisma: PrismaService,
        @Inject('SOCKET_SERVICE') private socketClient: ClientProxy
    ) {}

    @OnQueueActive()
    onActive(job: Job) {
        console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`)
    }

    @Process(BackgroundAction.reUpdateIsDrafOrder)
    async re_update_order(job: Job<{ orderIds: string[]; actionId: string }>) {
        let { data } = job
        try {
            await this.prisma.$transaction(
                data.orderIds.map((id) =>
                    this.prisma.order.update({
                        where: {
                            id
                        },
                        data: {
                            isDraf: false
                        }
                    })
                )
            )
            emit_update_Order_WhenCreatingOrder_fn(this.socketClient, {
                action: true,
                msg: 'Đặt hàng thành công',
                id: data.actionId,
                result: null
            })
        } catch (err) {
            console.log('Chạy background job để cập nhật lại isDraf thât bại', err)
        }
    }

    @Process(BackgroundAction.reUpdateIsDrafOrder)
    async delete_order(job: Job<string[]>) {
        let { data } = job
        try {
            await this.prisma.$transaction(
                data.map((id) =>
                    this.prisma.order.delete({
                        where: {
                            id
                        }
                    })
                )
            )
        } catch (err) {
            console.log('Chạy background job để xóa đơn hàng thât bại', err)
        }
    }
}
