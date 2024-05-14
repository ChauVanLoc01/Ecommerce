import { PrismaService } from '@app/common/prisma/prisma.service'
import { InjectQueue } from '@nestjs/bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Queue } from 'bull'
import { Cache } from 'cache-manager'
import { BackgroundName } from 'common/constants/background-job.constant'
import { getStoreDetail } from 'common/constants/event.constant'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { isUndefined, keyBy, omitBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateProductType } from './dtos/create-product.dto'
import { QueryProductType } from './dtos/query-product.dto'
import { UpdateProductType } from './dtos/update-product.dto'
import { SearchProductService } from './search-product.service'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('USER_SERVICE') private readonly user_service: ClientProxy,
    @Inject('STORE_SERVICE') private readonly store_service: ClientProxy,
    private readonly searchService: SearchProductService,
    private readonly configService: ConfigService,
    @InjectQueue(BackgroundName.product) private productBullQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async searchProduct(search: string) {
    const result = this.searchService.searchProduct(search)

    console.log(result)

    return result
  }

  async getALlProductForUser(query: QueryProductType): Promise<Return> {
    const {
      category,
      createdAt,
      price_max,
      price_min,
      sold,
      price,
      limit,
      page,
      max_date,
      min_date
    } = query

    if (
      Object.keys(
        omitBy(
          {
            createdAt,
            sold,
            price
          },
          isUndefined
        )
      ).length > 1
    ) {
      throw new BadRequestException('Tối đa 1 field order')
    }

    const [productAllLength, products] = await Promise.all([
      this.prisma.product.count({
        where: {
          category,
          priceAfter: {
            lte: price_max,
            gte: price_min
          },
          createdAt: {
            gte: min_date,
            lte: max_date
          }
        }
      }),
      this.prisma.product.findMany({
        where: {
          category,
          priceAfter: {
            lte: price_max,
            gte: price_min
          },
          createdAt: {
            gte: min_date,
            lte: max_date
          }
        },
        orderBy: {
          createdAt,
          sold,
          priceAfter: price
        },
        take: limit || this.configService.get<number>('app.limit_default'),
        skip:
          page && page > 0
            ? (page - 1) * (limit || this.configService.get<number>('app.limit_default'))
            : 0
      })
    ])

    const storeIdList = products.map((product) => product.storeId)

    const storeList = await firstValueFrom(this.store_service.send(getStoreDetail, storeIdList))

    const result = products.map((product) => {
      return {
        ...product,
        store: storeList[product.storeId]
      }
    })

    return {
      msg: 'Lấy danh sách sản phẩm thành công',
      result: {
        data: result,
        query: omitBy(
          {
            ...query,
            page: page || 1,
            page_size: Math.ceil(
              productAllLength / (limit || this.configService.get<number>('app.limit_default'))
            )
          },
          isUndefined
        )
      }
    }
  }

  async getProductByProductOrder(productsId: string[]) {
    const products = await Promise.all(
      productsId.map((id) =>
        this.prisma.product.findUnique({
          where: {
            id
          }
        })
      )
    )
    return keyBy(products, 'id')
  }

  async getALlProductForStore(storeId: string, query: QueryProductType): Promise<Return> {
    const {
      category,
      createdAt,
      price_max,
      price_min,
      sold,
      price,
      limit,
      page,
      max_date,
      min_date,
      status
    } = query

    if (
      Object.keys(
        omitBy(
          {
            createdAt,
            sold,
            price
          },
          isUndefined
        )
      ).length > 1
    ) {
      throw new BadRequestException('Tối đa 1 field order')
    }

    const [productAllLength, products] = await Promise.all([
      this.prisma.product.count({
        where: {
          storeId,
          category,
          status,
          priceAfter: {
            lte: price_max,
            gte: price_min
          },
          createdAt: {
            gte: min_date,
            lte: max_date
          }
        }
      }),
      this.prisma.product.findMany({
        where: {
          storeId,
          category,
          status,
          priceAfter: {
            lte: price_max,
            gte: price_min
          },
          createdAt: {
            gte: min_date,
            lte: max_date
          }
        },
        orderBy: {
          createdAt,
          sold,
          priceAfter: price
        },
        take: limit || this.configService.get<number>('app.limit_default'),
        skip:
          page && page > 0
            ? (page - 1) * (limit || this.configService.get<number>('app.limit_default'))
            : 0
      })
    ])

    return {
      msg: 'Lấy danh sách sản phẩm thành công',
      result: {
        data: products,
        query: omitBy(
          {
            ...query,
            page: page || 1,
            page_size: Math.ceil(
              productAllLength / (limit || this.configService.get<number>('app.limit_default'))
            )
          },
          isUndefined
        )
      }
    }
  }

  async getAllProductOrderByOrderId(orderId: string): Promise<Return> {
    return {
      msg: 'ok',
      result: await this.prisma.productOrder.findMany({
        where: {
          orderId
        },
        include: {
          Product: true
        }
      })
    }
  }

  async getProductDetail(productId: string): Promise<Return> {
    const productExist = await this.prisma.product.findUnique({
      where: {
        id: productId,
        status: Status.ACTIVE
      }
    })

    if (!productExist) throw new NotFoundException('Sản phẩm không tồn tại')

    return {
      msg: 'Lấy thông tin chi tiết sản phẩm thành công',
      result: productExist
    }
  }

  async analyticsProduct(store: CurrentStoreType): Promise<Return> {
    const [all, active, block, deleted] = await Promise.all([
      this.prisma.product.count({
        where: {
          storeId: store.storeId
        }
      }),
      this.prisma.product.count({
        where: {
          isDelete: false,
          status: 'ACTIVE',
          storeId: store.storeId
        }
      }),
      this.prisma.product.count({
        where: {
          isDelete: false,
          status: 'BLOCK',
          storeId: store.storeId
        }
      }),
      this.prisma.product.count({
        where: {
          isDelete: true,
          storeId: store.storeId
        }
      })
    ])

    return {
      msg: 'Lấy thông tin thành công',
      result: {
        all,
        active,
        block,
        deleted
      }
    }
  }

  async createProduct(user: CurrentStoreType, body: CreateProductType): Promise<Return> {
    const { storeId, userId } = user

    const {
      name,
      initQuantity,
      priceAfter,
      priceBefore,
      description,
      status,
      category,
      productImages,
      imagePrimary
    } = body

    const createdProduct = await this.prisma.product.create({
      data: {
        id: uuidv4(),
        name,
        currentQuantity: initQuantity,
        initQuantity,
        priceBefore: priceBefore || 0,
        priceAfter: priceAfter,
        description,
        image: imagePrimary,
        status: status || Status.ACTIVE,
        storeId,
        createdBy: userId,
        category
      }
    })

    await Promise.all(
      productImages.map((img) =>
        this.prisma.productImage.create({
          data: {
            id: uuidv4(),
            url: img,
            createdAt: new Date(),
            createdBy: user.userId,
            productId: createdProduct.id
          }
        })
      )
    )

    return {
      msg: 'Tạo sản phẩm thành công',
      result: {
        ...createdProduct,
        productImages
      }
    }
  }

  async updateProduct(
    user: CurrentStoreType,
    productId: string,
    body: UpdateProductType
  ): Promise<Return> {
    const { storeId } = user
    const productExist = await this.prisma.product.findUnique({
      where: {
        id: productId,
        storeId
      }
    })

    if (!productExist) throw new NotFoundException('Sản phẩm không tồn tại')

    const { category, description, initQuantity, name, priceAfter, priceBefore, status } = body

    const init = initQuantity ?? 0

    return {
      msg: 'Cập nhật sản phẩm thành công',
      result: await this.prisma.product.update({
        where: {
          id: productId,
          storeId
        },
        data: {
          category,
          initQuantity:
            init > 0
              ? {
                  increment: init
                }
              : {
                  decrement: init
                },
          currentQuantity:
            init > 0
              ? {
                  increment: init
                }
              : {
                  decrement: init
                },
          name,
          description,
          priceAfter,
          priceBefore,
          status
        }
      })
    }
  }

  async deleteProduct(user: CurrentStoreType, productId: string): Promise<Return> {
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

  async updateQuantityProducts(
    data: { storeId: string; note?: string; orders: { productId: string; quantity: number }[] }[]
  ) {
    try {
      const convertData: { storeId: string; productId: string; quantity: number }[] = data.reduce(
        (acu, e) => {
          return [
            ...acu,
            ...e.orders.map((order) => {
              return {
                storeId: e.storeId,
                productId: order.productId,
                quantity: order.quantity
              }
            })
          ]
        },
        []
      )

      const productsExist = await Promise.all(
        convertData.map((e) => {
          return this.prisma.product.findUnique({
            where: {
              id: e.productId,
              storeId: e.storeId
            }
          })
        })
      )

      const productExistConvert = productsExist.filter((e) => e)

      if (productExistConvert.length < convertData.length) {
        throw new Error('Sản phẩm không tồn tại trong cửa hàng')
      }

      const result = await this.prisma.$transaction(async (tx) => {
        const updatedProduct = await Promise.all(
          convertData.map((e) => {
            return tx.product.update({
              where: {
                id: e.productId
              },
              data: {
                currentQuantity: {
                  decrement: e.quantity
                }
              }
            })
          })
        )

        updatedProduct.forEach((e) => {
          if (e.currentQuantity < 0) {
            throw new Error('Số lượng sản phẩm không đủ')
          }
        })

        return updatedProduct
      })

      return result
    } catch (err) {
      return err.message
    }
  }

  async createProductOrder(
    data: {
      orderId: string
      productId: string
      priceAfter: number
      priceBefore: number
      quantity: number
    }[]
  ) {
    try {
      const orders = await Promise.all(
        data.map((e) =>
          this.prisma.order.findUnique({
            where: {
              id: e.orderId
            }
          })
        )
      )

      console.log('orders', orders)

      const result = await Promise.all(
        data.map((e) =>
          this.prisma.productOrder.create({
            data: {
              id: uuidv4(),
              priceAfter: e.priceAfter,
              priceBefore: e.priceBefore,
              quantity: e.quantity,
              orderId: e.orderId,
              productId: e.productId
            }
          })
        )
      )

      return result
    } catch (err) {
      console.log('errr', err)
      return 'Lỗi tạo product-order'
    }
  }

  async updateData() {
    const products = await this.prisma.product.findMany()

    await Promise.all(
      products.map((product) =>
        this.prisma.productImage.create({
          data: {
            id: uuidv4(),
            url: product.image,
            productId: product.id,
            createdAt: new Date(),
            createdBy: product.createdBy
          }
        })
      )
    )

    return {
      msg: 'ok'
    }
  }
}
