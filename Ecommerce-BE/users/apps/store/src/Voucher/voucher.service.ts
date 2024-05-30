import { PrismaService } from '@app/common/prisma/prisma.service'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Prisma } from '@prisma/client'
import { checkVoucherExistInOrder } from 'common/constants/event.constant'
import { VoucherType } from 'common/constants/voucher.constant'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { addHours, addMinutes } from 'date-fns'
import { isUndefined, omitBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateVoucherDTO } from './dtos/CreateVoucher.dto'
import { VoucherQueryDTO } from './dtos/QueryVoucher.dto'
import { UpdateVoucherDTO } from './dtos/UpdateVoucher.dto'
import { SearchCodeDTO } from './dtos/search-code.dto'
import { Status } from 'common/enums/status.enum'

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

    if (exist.length > 0) {
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

    const createdVoucher = await this.prisma.$transaction(async (tx) => {
      var createdPriceCondition, createdCategoryCondition
      if (totalMin || priceMin) {
        createdPriceCondition = await this.prisma.priceConditionVoucher.create({
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
        createdCategoryCondition = await this.prisma.categoryConditionVoucher.create({
          data: {
            id: uuidv4(),
            categoryShortName: category,
            createdAt: new Date().toISOString(),
            createdBy: user.userId
          }
        })
      }

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
          categoryConditionId: createdCategoryCondition ? createdCategoryCondition.id : undefined,
          priceConditionId: createdPriceCondition ? createdPriceCondition.id : undefined,
          description,
          maximum,
          percent,
          storeId: user.storeId,
          createdBy: user.userId,
          createdAt: new Date().toISOString()
        }
      })

      return createdVoucher
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
            gte: startDate,
            lte: endDate
          },
          endDate: {
            lte: endDate,
            gte: startDate
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
            gte: startDate,
            lte: endDate
          },
          endDate: {
            lte: endDate,
            gte: startDate
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

  async voucherAnalytics(user: CurrentStoreType): Promise<Return> {
    const { storeId } = user
    const [all, active, block] = await Promise.all([
      this.prisma.voucher.count({
        where: {
          storeId
        }
      }),
      this.prisma.voucher.count({
        where: {
          storeId,
          status: 'ACTIVE'
        }
      }),
      this.prisma.voucher.count({
        where: {
          storeId,
          status: 'BLOCK'
        }
      })
    ])
    return {
      msg: 'ok',
      result: {
        all,
        active,
        block
      }
    }
  }

  async getUserVoucherByStore(user: CurrentUserType, storeId: string): Promise<Return> {
    const vouchersValid = await this.prisma.voucher.findMany({
      where: {
        storeId,
        status: Status.ACTIVE,
        currentQuantity: {
          gte: 1
        },
        type: VoucherType.store,
        endDate: {
          gt: addMinutes(addHours(new Date(), 7), 1)
        }
      },
      include: {
        CategoryConditionVoucher: true,
        PriceConditionVoucher: true
      }
    })

    return {
      msg: 'ok',
      result: vouchersValid
    }
  }

  async getUserVoucherByGlobal(user: CurrentUserType): Promise<Return> {
    const userVouchers = await this.prisma.userVoucher.findMany({
      where: {
        userId: user.id
      }
    })

    const vouchersValid = await Promise.all(
      userVouchers.map((voucher) =>
        this.prisma.voucher.findUnique({
          where: {
            id: voucher.voucherId,
            status: Status.ACTIVE,
            currentQuantity: {
              gte: 1
            },
            type: VoucherType.global
          },
          include: {
            CategoryConditionVoucher: true,
            PriceConditionVoucher: true
          }
        })
      )
    )

    return {
      msg: 'ok',
      result: vouchersValid
    }
  }

  async searchVoucherByCode(body: SearchCodeDTO): Promise<Return> {
    try {
      const { code, storesID } = body
      const vouchers = (
        await Promise.all(
          storesID.map((storeId) =>
            this.prisma.voucher.findFirst({
              where: {
                storeId,
                code,
                status: {
                  in: [Status.ACTIVE, Status.HIDDEN]
                },
                endDate: {
                  gt: addMinutes(addHours(new Date(), 7), 1)
                }
              }
            })
          )
        )
      ).filter((e) => e)

      if (!vouchers.length) {
        return {
          msg: 'ok',
          result: false
        }
      }

      return {
        msg: 'ok',
        result: vouchers
      }
    } catch (err) {
      throw new InternalServerErrorException('Lỗi BE')
    }
  }

  async checkVoucherExistToCreateOrder(voucherIds: string[]) {
    try {
      const vouchers = await Promise.all(
        voucherIds.map((id) =>
          this.prisma.voucher.findUnique({
            where: {
              id
            },
            include: {
              CategoryConditionVoucher: true,
              PriceConditionVoucher: true
            }
          })
        )
      )

      return vouchers
    } catch (err) {
      return 'Lỗi BE'
    }
  }
}
