import { PrismaService } from '@app/common/prisma/prisma.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Return } from 'common/types/result.type'
import { CreateProductType } from './dtos/create-product.dto'
import { UpdateProductType } from './dtos/update-product.dto'
import { v4 as uuidv4 } from 'uuid'
import { Status } from 'common/enums/status.enum'
import { CurrentUserType } from 'common/types/current.type'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('USER_SERVICE') private readonly user_service: ClientProxy
  ) {}

  async getALlProduct() {}

  async getProductDetail(productId: string): Promise<Return> {
    const productExist = await this.prisma.product.findUnique({
      where: {
        id: productId
      }
    })

    if (!productExist) throw new NotFoundException('Sản phẩm không tồn tại')

    return {
      msg: 'Lấy thông tin chi tiết sản phẩm thành công',
      result: productExist
    }
  }

  async createProduct(
    user: CurrentUserType,
    imageUrl: string,
    body: CreateProductType
  ): Promise<Return> {
    const { name, initQuantity, priceAfter, priceBefore, description, status } =
      body

    const storeRoleExist = await this.prisma.storeRole.findUnique({
      where: {
        id: user.storeRoleId
      }
    })

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
          storeId: storeRoleExist.storeId,
          createdBy: user.storeRoleId
        }
      })
    }
  }

  async updateProduct(
    user: CurrentUserType,
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
        data: { ...rest }
      })
    }
  }

  async deleteProduct(userId: string, productId: string): Promise<Return> {
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
