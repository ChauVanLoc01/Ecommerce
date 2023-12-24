import { PrismaService } from '@app/common/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { QueryCategoryType } from './dtos/query-category.dto'
import { Return } from 'common/types/result.type'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategory(query: QueryCategoryType): Promise<Return> {
    return {
      msg: 'Lấy danh mục sản phẩm thành công',
      result: await this.prisma.category.findMany({
        where: {
          shortname: query.category_name
        }
      })
    }
  }

  updateCategory(categoryId: string) {}

  deleteCategory(categoryId: string) {}
}
