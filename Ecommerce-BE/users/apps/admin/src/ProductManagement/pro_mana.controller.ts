import { Controller, Get, Param, Put } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { ProductManagementService } from './pro_mana.service'

@Roles(Role.ADMIN)
@ApiBearerAuth()
@Controller('admin')
export class ProductManagementController {
  constructor(
    private readonly productManagementService: ProductManagementService
  ) {}

  @Get()
  analyticProduct() {
    return this.productManagementService.analyticProduct()
  }

  @Put(':productId')
  blockProduct(@Param('productId') productId: string) {}
}
