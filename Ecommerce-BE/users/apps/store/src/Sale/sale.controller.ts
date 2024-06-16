import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common'
import { ScheduleService } from './schedule.service'
import { SaleService } from './sale.service'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CreateProductSalePromotionDTO } from './dtos/create-product-sale.dto'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { UpdateProductSalePromotion } from './dtos/update-product-sale.dto'

@UseGuards(JwtGuard)
@Controller()
export class SaleController {
  constructor(
    private readonly saleService: SaleService,
    private readonly prisma: PrismaService
  ) {}

  @Post('adding-product')
  addingProduct(
    @CurrentUser() user: CurrentStoreType,
    @Body() body: CreateProductSalePromotionDTO
  ) {
    return this.saleService.addingProduct(user, body)
  }

  @Put('update-product')
  updateProduct(@CurrentUser() user: CurrentStoreType, @Body() body: UpdateProductSalePromotion) {
    return this.saleService.updateProduct(user, body)
  }
}
