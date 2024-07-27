import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { getProductSaleEvent, refreshProductSale } from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { PaginationDTO } from 'common/decorators/pagination.dto'
import { Public } from 'common/decorators/public.decorator'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType } from 'common/types/current.type'
import { CreateProductSalePromotionDTO } from './dtos/create-product-sale.dto'
import { QuerySalePromotionDTO } from './dtos/query-promotion.dto'
import { UpdateProductsSalePromotion } from './dtos/update-product-sale.dto'
import { SaleService } from './sale.service'
import { CreateSpecialSaleDTO } from './dtos/special-sale.dto'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { ProductSaleIds } from './dtos/product-sale-ids.dto'

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
    @Get('products/:salePromotionId')
    getCurrentSaleId(
        @Param('salePromotionId') salePromotionId: string,
        @Query() query: ProductSaleIds
    ) {
        return this.saleService.getProductSaleDetail(salePromotionId, query)
    }

    @Public()
    @Get(':salePromotionId/product')
    getAllProduct(
        @Param('salePromotionId') salePromotionId: string,
        @Query() query: PaginationDTO
    ) {
        return this.saleService.getAllProduct(salePromotionId, query)
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

    @Public()
    @MessagePattern(getProductSaleEvent)
    getProductSaleEvent(@Payload() productId: string) {
        return this.saleService.getProductSaleEvent(productId)
    }

    @Public()
    @MessagePattern(refreshProductSale)
    refreshProductSale(@Payload() payload: { saleId: string; productIds: string[] }) {
        return this.saleService.refreshProductSale(payload)
    }

    @Roles(Role.ADMIN)
    @Post('special-sale')
    createSpecialSale(@CurrentUser() user: CurrentStoreType, @Body() body: CreateSpecialSaleDTO) {
        return this.saleService.createSpecialSale(user, body)
    }
}
