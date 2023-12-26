import { PrismaService } from '@app/common/prisma/prisma.service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Return } from 'common/types/result.type'
import { CreateProductType } from './dtos/create-product.dto'
import { UpdateProductType } from './dtos/update-product.dto'

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

  async createProduct(imageUrl: string, body: CreateProductType) {}

  async updateProduct(body: UpdateProductType, imageUrl?: string) {}

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
