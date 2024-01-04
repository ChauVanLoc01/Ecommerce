import { Processor, Process } from '@nestjs/bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InternalServerErrorException } from '@nestjs/common'
import { Inject } from '@nestjs/common/decorators'
import { ConfigService } from '@nestjs/config'
import { Product } from '@prisma/client'
import { Job } from 'bull'
import { Cache } from 'cache-manager'
import { BackgroundName, BackgroundAction } from 'common/constants/background-job.constant'

@Processor(BackgroundName.order)
export class ProductConsummer {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService
  ) {}

  @Process(BackgroundAction.createOrder)
  async cacheProduct({ data }: Job<>) {
    await this.cacheManager.set(
      data.id,
      JSON.stringify(data),
      this.configService.get<number>('bullqueue.ttl')
    )
  }
}
