import { Processor, Process } from '@nestjs/bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InternalServerErrorException } from '@nestjs/common'
import { Inject } from '@nestjs/common/decorators'
import { ConfigService } from '@nestjs/config'
import { Product } from '@prisma/client'
import { Job } from 'bull'
import { Cache } from 'cache-manager'
import { BackgroundName, BackgroundAction } from 'common/constants/background-job.constant'

@Processor(BackgroundName.product)
export class ProductConsummer {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService
  ) {}

  @Process(BackgroundAction.addToCache)
  async cacheProduct({ data }: Job<Product>) {
    await this.cacheManager.set(
      data.id,
      JSON.stringify(data),
      this.configService.get<number>('bullqueue.ttl')
    )
  }

  @Process(BackgroundAction.changeQuantityProduct)
  async changeQuantity({ data }: Job<[string, number][]>) {
    try {
      await Promise.all(
        data.map(async (order) => {
          const [productId, quantity] = order

          const stringifyProduct: string = await this.cacheManager.get(productId)

          const jsonProduct = JSON.parse(stringifyProduct) as Product

          await this.cacheManager.del(productId)

          await this.cacheManager.set(productId, {
            ...jsonProduct,
            currentQuantity: quantity
          } as Product)
        })
      )
    } catch (err) {
      throw new InternalServerErrorException('Lỗi xử lý cache')
    }
  }
}
