import { Body, Controller, Post, Put, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType } from 'common/types/current.type'
import { CreateProductSalePromotionDTO } from './dtos/create-product-sale.dto'
import { UpdateProductSalePromotion } from './dtos/update-product-sale.dto'
import { SaleService } from './sale.service'

@UseGuards(JwtGuard)
@Controller('sale-promotion')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}

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
