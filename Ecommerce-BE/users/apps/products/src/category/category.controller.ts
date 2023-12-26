import { Controller, Delete, Get, Param, Put, Query } from '@nestjs/common'
import { CategoryService } from './category.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getAllCategory() {
    return this.categoryService.getAllCategory()
  }

  @Roles(Role.ADMIN)
  @Put(':categoryId')
  updateCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.updateCategory(categoryId)
  }

  @Roles(Role.ADMIN)
  @Delete(':categoryId')
  deleteCategory(@Param('categoryId') categoryId: string) {
    return this.categoryService.deleteCategory(categoryId)
  }
}
