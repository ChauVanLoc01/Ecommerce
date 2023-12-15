import { PrismaService } from '@app/common/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  getAllCategory() {}

  updateCategory(categoryId: string) {}

  deleteCategory(categoryId: string) {}
}
