import { PrismaService } from '@app/common/prisma/prisma.service'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Prisma } from '@prisma/client'
import { checkVoucherExistInOrder } from 'common/constants/event.constant'
import { CurrentStoreType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { isUndefined, omitBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateVoucherDTO } from './dtos/CreateVoucher.dto'
import { VoucherQueryDTO } from './dtos/QueryVoucher.dto'
import { UpdateVoucherDTO } from './dtos/UpdateVoucher.dto'

@Injectable()
export class VoucherService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
    private readonly configService: ConfigService
  ) {}

  async createVoucher(user: CurrentStoreType, body: CreateVoucherDTO): Promise<Return> {
    const exist = await this.prisma.voucher.findMany({
      where: {
        storeId: user.storeId,
        code: body.code,
        endDate: {
          gte: new Date().toISOString()
        }
      }
    })

    if (exist) {
      throw new BadRequestException('Tồn tại 1 mã giảm giá còn hiệu lực với mã code đó')
    }

    const {
      initQuantity,
      maximum,
      percent,
      title,
      type,
      category,
      code,
      description,
      priceMin,
      status,
      totalMin,
      endDate,
      startDate
    } = body

    var createdPriceCondition, createdCategoryCondition

    if (totalMin || priceMin) {
      createdPriceCondition = this.prisma.priceConditionVoucher.create({
        data: {
          id: uuidv4(),
          totalMin,
          priceMin,
          createdAt: new Date().toISOString(),
          createdBy: user.userId
        }
      })
    }

    if (category) {
      createdCategoryCondition = this.prisma.categoryConditionVoucher.create({
        data: {
          id: uuidv4(),
          categoryShortName: category,
          createdAt: new Date().toISOString(),
          createdBy: user.userId
        }
      })
    }

    const [priceCondition, categoryCondition] = await this.prisma.$transaction([
      createdPriceCondition,
      createdCategoryCondition
    ])

    const createdVoucher = await this.prisma.voucher.create({
      data: {
        id: uuidv4(),
        code,
        initQuantity,
        currentQuantity: initQuantity,
        startDate,
        endDate,
        status,
        title,
        type,
        categoryConditionId: categoryCondition.id,
        priceConditionId: priceCondition.id,
        description,
        maximum,
        percent,
        storeId: user.storeId,
        createdBy: user.userId,
        createdAt: new Date().toISOString()
      }
    })

    return {
      msg: 'ok',
      result: createdVoucher
    }
  }

  async updateVoucher(
    user: CurrentStoreType,
    voucherId: string,
    body: UpdateVoucherDTO
  ): Promise<Return> {
    try {
      const usedToVoucher = await firstValueFrom(
        this.orderClient.send(checkVoucherExistInOrder, voucherId)
      )

      if (typeof usedToVoucher === 'string') {
        throw new Error('Không thể cập nhật mã giảm giá khi đã sử dụng')
      }

      const {
        initQuantity,
        maximum,
        percent,
        status,
        title,
        category,
        code,
        description,
        endDate,
        priceMin,
        startDate,
        totalMin
      } = body
      const voucherExist = await this.prisma.voucher.findUnique({
        where: {
          id: voucherId
        }
      })

      if (!voucherExist) {
        throw new Error('Mã giảm giá không tồn tại')
      }

      const updatedVoucher = await this.prisma.voucher.update({
        where: {
          id: voucherId,
          storeId: user.storeId
        },
        data: {
          code,
          title,
          maximum,
          initQuantity,
          percent,
          status,
          description,
          endDate,
          startDate,
          updatedAt: new Date().toISOString(),
          updatedBy: user.userId,
          CategoryConditionVoucher: {
            update: {
              categoryShortName: category,
              updatedBy: user.userId,
              updatedAt: new Date().toISOString()
            }
          },
          PriceConditionVoucher: {
            update: {
              priceMin,
              totalMin,
              updatedBy: user.userId,
              updatedAt: new Date().toISOString()
            }
          }
        }
      })

      return {
        msg: 'ok',
        result: updatedVoucher
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Lỗi xảy ra trong quá trình cập nhật')
      }
      throw new BadRequestException(err.message)
    }
  }

  async getDetail(user: CurrentStoreType, voucherId: string): Promise<Return> {
    const voucherExist = await this.prisma.voucher.findUnique({
      where: {
        id: voucherId,
        storeId: user.storeId
      },
      include: {
        CategoryConditionVoucher: true,
        PriceConditionVoucher: true
      }
    })

    if (!voucherExist) {
      throw new NotFoundException('Mã giảm giá không tồn tại')
    }

    return {
      msg: 'ok',
      result: voucherExist
    }
  }

  async getAllVoucher(user: CurrentStoreType, query: VoucherQueryDTO): Promise<Return> {
    const { storeId } = user
    const { endDate, limit, page, startDate, status, code, createdAt } = query

    const take = limit | this.configService.get('app.limit_default')

    const [length, vouchers] = await Promise.all([
      this.prisma.voucher.count({
        where: {
          storeId,
          code: {
            contains: code
          },
          status,
          startDate: {
            gte: startDate
          },
          endDate: {
            lte: endDate
          }
        }
      }),
      this.prisma.voucher.findMany({
        where: {
          storeId,
          code: {
            contains: code
          },
          status,
          startDate: {
            gte: startDate
          },
          endDate: {
            lte: endDate
          }
        },
        orderBy: {
          createdAt
        },
        take,
        skip: page && page > 1 ? (page - 1) * take : 0
      })
    ])

    return {
      msg: 'ok',
      result: {
        data: vouchers,
        query: omitBy(
          {
            ...query,
            page: page || 1,
            page_size: Math.ceil(length / take)
          },
          isUndefined
        )
      }
    }
  }
}
