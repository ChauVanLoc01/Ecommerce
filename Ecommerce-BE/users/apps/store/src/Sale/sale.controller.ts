import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType } from 'common/types/current.type'
import { CreateProductSalePromotionDTO } from './dtos/create-product-sale.dto'
import { QuerySalePromotionDTO } from './dtos/query-promotion.dto'
import { UpdateProductsSalePromotion } from './dtos/update-product-sale.dto'
import { SaleService } from './sale.service'
import { Public } from 'common/decorators/public.decorator'
import { PaginationDTO } from 'common/decorators/pagination.dto'

@UseGuards(JwtGuard)
@Controller('sale-promotion')
export class SaleController {
    constructor(private readonly saleService: SaleService) {}

    @Public()
    @Get('sale-promotion-in-day')
    getSalePromotionsInDay() {
        return this.saleService.getSalePromotionsInDay()
    }

    @Public()
    @Get('current-sale')
    getCurrentSale() {
        return this.saleService.getCurrentSale()
    }

    @Public()
    @Get(':salePromotionId/product')
    getAllProduct(
        @CurrentUser() store: CurrentStoreType,
        @Param('salePromotionId') salePromotionId: string,
        @Query() query: PaginationDTO
    ) {
        return this.saleService.getAllProduct(store, salePromotionId, query)
    }

    @Get(':storePromotionId')
    getSalePromotionDetail(@Param('storePromotionId') storePromotionId: string) {
        return this.saleService.getSalePromotionDetail(storePromotionId)
    }

    @Get()
    getSalePromotion(@CurrentUser() user: CurrentStoreType, @Query() query: QuerySalePromotionDTO) {
        return this.saleService.getSalePromotion(user, query)
    }

    @Post()
    addingProduct(
        @CurrentUser() user: CurrentStoreType,
        @Body() body: CreateProductSalePromotionDTO
    ) {
        return this.saleService.addingProduct(user, body)
    }

    @Put()
    updateProduct(
        @CurrentUser() user: CurrentStoreType,
        @Body() body: UpdateProductsSalePromotion
    ) {
        return this.saleService.updateProduct(user, body)
    }
}
