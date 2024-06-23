import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger'
import {
    createProductOrder,
    getAllProductWithProductOrder,
    getProductOrderByRating,
    productDetailPromotion,
    updateQuantityProducts,
    updateQuantiyProductsWhenCancelOrder
} from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType } from 'common/types/current.type'
import { AnalyticsProductDTO } from './dtos/analytics-product.dto'
import { CreateUserAddProductToCartDTO } from './dtos/create-product-add-to-cart.dto'
import { CreateUserViewProductDto } from './dtos/create-product-view.dto'
import { CreateProductDTO } from './dtos/create-product.dto'
import { QueryProductDTO } from './dtos/query-product.dto'
import { RefreshCartDTO } from './dtos/refresh-cart.dto'
import { UpdateProductDTO } from './dtos/update-product.dto'
import { ProductService } from './product.service'

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('product')
export class ProductController {
    constructor(private readonly productsService: ProductService) {}

    @Public()
    @Get('update-data')
    updateData() {
        return this.productsService.updateData()
    }

    @Public()
    @Post('refresh-cart')
    refreshCart(@Body() body: RefreshCartDTO) {
        return this.productsService.refreshCart(body)
    }

    @Roles(Role.EMPLOYEE, Role.STORE_OWNER)
    @Get('analytic')
    analyticsProduct(@CurrentUser() store: CurrentStoreType) {
        return this.productsService.analyticsProduct(store)
    }

    @Roles(Role.STORE_OWNER)
    @Get('top-10')
    top10ProductView(@CurrentUser() user: CurrentStoreType, @Body() body: AnalyticsProductDTO) {
        return this.productsService.top10ProductView(user, body)
    }

    @Public()
    @Get('product-store/:storeId')
    getAllForStore(@Param('storeId') storeId: string, @Query() query: QueryProductDTO) {
        return this.productsService.getALlProductForStore(storeId, query)
    }

    @Roles(Role.EMPLOYEE, Role.ADMIN, Role.STORE_OWNER)
    @Get('product-order')
    getAllProductOrderByOrderId(@CurrentUser() user: CurrentStoreType) {
        return this.productsService.getAllProductOrderByOrderId(user.storeId)
    }

    @Public()
    @Get()
    getAllForUser(@Query() query: QueryProductDTO) {
        return this.productsService.getALlProductForUser(query)
    }

    @ApiProperty({ description: 'Chi tiết sản phẩm' })
    @Public()
    @Get(':productId')
    getProductDetail(@Param('productId') productId: string) {
        return this.productsService.getProductDetail(productId)
    }

    @Public()
    @MessagePattern(getAllProductWithProductOrder)
    getProductByProductOrder(@Payload() payload: string[]) {
        return this.productsService.getProductByProductOrder(payload)
    }

    @Public()
    @Post('view-product')
    createViewProduct(@Body() body: CreateUserViewProductDto) {
        return this.productsService.createViewProduct(body)
    }

    @Public()
    @Post('add-product-to-cart')
    createUserAddProductToCart(@Body() body: CreateUserAddProductToCartDTO) {
        return this.productsService.createUserAddProductToCart(body)
    }

    @Roles(Role.EMPLOYEE, Role.STORE_OWNER)
    @Post()
    createProduct(@CurrentUser() user: CurrentStoreType, @Body() body: CreateProductDTO) {
        return this.productsService.createProduct(user, body)
    }

    @Roles(Role.EMPLOYEE, Role.STORE_OWNER)
    @Put(':productId')
    updateProduct(
        @Param('productId') productId: string,
        @CurrentUser() user: CurrentStoreType,
        @Body() body: UpdateProductDTO
    ) {
        return this.productsService.updateProduct(user, productId, body)
    }

    @Roles(Role.STORE_OWNER)
    @Delete(':productId')
    deleteProduct(@CurrentUser() user: CurrentStoreType, @Param('productId') productId: string) {
        return this.productsService.deleteProduct(user, productId)
    }

    @Public()
    @MessagePattern(updateQuantityProducts)
    updateQuantiyProducts(
        @Payload()
        data: {
            storeId: string
            note?: string
            productId: string
            quantity: number
        }[]
    ) {
        return this.productsService.updateQuantityProducts(data)
    }

    @Public()
    @MessagePattern(updateQuantiyProductsWhenCancelOrder)
    updateQuantiyProductsWhenCancelOrder(
        @Payload()
        data: string
    ) {
        return this.productsService.updateQuantiyProductsWhenCancelOrder(data)
    }

    @Public()
    @MessagePattern(createProductOrder)
    createProductOrder(
        @Payload()
        data: {
            orderId: string
            productId: string
            priceAfter: number
            priceBefore: number
            quantity: number
        }[]
    ) {
        return this.productsService.createProductOrder(data)
    }

    @Public()
    @MessagePattern(getProductOrderByRating)
    getProductOrderByRating(@Payload() payload: { productId: string; orders: string[] }) {
        return this.productsService.getProductOrderByRating(payload.productId, payload.orders)
    }
}
