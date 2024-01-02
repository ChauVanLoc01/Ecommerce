import { PrismaService } from '@app/common/prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { Return } from 'common/types/result.type'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategory(): Promise<Return> {
    return {
      msg: 'Lấy danh mục sản phẩm thành công',
      result: await this.prisma.category.findMany()
    }
  }

  updateCategory(categoryId: string) {}

  deleteCategory(categoryId: string) {}
}
