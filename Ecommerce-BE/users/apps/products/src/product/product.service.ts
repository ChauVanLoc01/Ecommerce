import { PrismaService } from '@app/common/prisma/prisma.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Return } from 'common/types/result.type'
import { CreateProductType } from './dtos/create-product.dto'
import { UpdateProductType } from './dtos/update-product.dto'
import { v4 as uuidv4 } from 'uuid'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType } from 'common/types/current.type'
import { SearchProductService } from './search-product.service'
import { QueryProductType } from './dtos/query-product.dto'
import { ConfigService } from '@nestjs/config'
import { InjectQueue } from '@nestjs/bull'
import { QueueAction, QueueName } from 'common/constants/queue.constant'
import { Queue } from 'bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('USER_SERVICE') private readonly user_service: ClientProxy,
    private readonly searchService: SearchProductService,
    private readonly configService: ConfigService,
    @InjectQueue(QueueName.product) private productBullQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async searchProduct(search: string) {
    const result = this.searchService.searchProduct(search)

    console.log(result)

    return result
  }

  async getALlProduct(query: QueryProductType): Promise<Return> {
    const {
      category,
      createdAt,
      end_date,
      price_max,
      price_min,
      sell,
      start_date,
      limit,
      page
    } = query

    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            category,
            createdAt: {
              lte: end_date,
              gte: start_date
            },
            priceBefore: {
              lte: price_max,
              gte: price_min
            }
          },
          {
            category,
            createdAt: {
              lte: end_date,
              gte: start_date
            },
            priceAfter: {
              lte: price_max,
              gte: price_min
            }
          }
        ]
      },
      orderBy: {
        createdAt,
        rate: sell
      },
      take: limit | this.configService.get<number>('app.limit_default'),
      skip: page && page > 0 ? (page - 1) * limit : 0
    })

    return {
      msg: 'Lấy danh sách sản phẩm thành công',
      result: products
    }
  }

  async getProductDetail(productId: string): Promise<Return> {
    const productInCache = await this.cacheManager.get(productId)

    if (!productInCache) {
      const productExist = await this.prisma.product.findUnique({
        where: {
          id: productId
        }
      })

      if (!productExist) throw new NotFoundException('Sản phẩm không tồn tại')

      await this.productBullQueue.add(QueueAction.addToCache, productId)

      return {
        msg: 'Lấy thông tin chi tiết sản phẩm thành công',
        result: productExist
      }
    }
    return {
      msg: 'Lấy thông tin chi tiết sản phẩm thành công',
      result: JSON.parse(productInCache as string)
    }
  }

  async createProduct(
    user: CurrentStoreType,
    imageUrl: string,
    body: CreateProductType
  ): Promise<Return> {
    const { storeId, userId } = user

    const { name, initQuantity, priceAfter, priceBefore, description, status } =
      body

    return {
      msg: 'Tạo sản phẩm thành công',
      result: await this.prisma.product.create({
        data: {
          id: uuidv4(),
          name,
          currentQuantity: initQuantity,
          initQuantity,
          priceBefore,
          priceAfter: priceAfter | 0,
          description,
          image: imageUrl,
          status: status | Status.ACCESS,
          storeId,
          createdBy: userId
        }
      })
    }
  }

  async updateProduct(
    user: CurrentStoreType,
    productId: string,
    body: UpdateProductType,
    imageUrl?: string
  ): Promise<Return> {
    const productExist = await this.prisma.product.findUnique({
      where: {
        id: productId
      }
    })

    if (!productExist) throw new NotFoundException('Sản phẩm không tồn tại')

    const { image, ...rest } = body

    return {
      msg: 'Cập nhật sản phẩm thành công',
      result: await this.prisma.product.update({
        where: {
          id: productId
        },
        data: { ...rest, updatedBy: user.userId, image: imageUrl }
      })
    }
  }

  async deleteProduct(
    user: CurrentStoreType,
    productId: string
  ): Promise<Return> {
    const { userId } = user

    const productExist = await this.prisma.product.update({
      where: {
        id: productId
      },
      data: {
        deletedAt: new Date(),
        deletedBy: userId
      }
    })

    if (!productExist) throw new NotFoundException('Sản phẩm không tồn tại')

    return {
      msg: 'Xóa sản phẩm thành công',
      result: undefined
    }
  }
}
