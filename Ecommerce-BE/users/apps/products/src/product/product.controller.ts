import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger'
import {
  createProductOrder,
  getAllProductWithProductOrder,
  getProductOrderByRating,
  updateQuantityProducts
} from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { AnalyticsProductDTO } from './dtos/analytics-product.dto'
import { CreateUserAddProductToCartDTO } from './dtos/create-product-add-to-cart.dto'
import { CreateUserViewProductDto } from './dtos/create-product-view.dto'
import { CreateProductDTO } from './dtos/create-product.dto'
import { QueryProductDTO } from './dtos/query-product.dto'
import { UpdateProductDTO } from './dtos/update-product.dto'
import { ProductService } from './product.service'
import { SearchProductService } from './search-product.service'

@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(
    private readonly productsService: ProductService,
    private searchProductService: SearchProductService
  ) {}

  @Public()
  @Get('update-data')
  updateData() {
    return this.productsService.updateData()
  }

  @Public()
  @Get('es-search')
  searchProduct(@Query('search') search: string) {
    return this.productsService.searchProduct(search)
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

  @Roles(Role.USER)
  @Post('view-product')
  createViewProduct(@CurrentUser() user: CurrentUserType, @Body() body: CreateUserViewProductDto) {
    return this.productsService.createViewProduct(user, body)
  }

  @Roles(Role.USER)
  @Post('add-product-to-cart')
  createUserAddProductToCart(
    @CurrentUser() user: CurrentUserType,
    @Body() body: CreateUserAddProductToCartDTO
  ) {
    return this.productsService.createUserAddProductToCart(user, body)
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
    data: { storeId: string; note?: string; orders: { productId: string; quantity: number }[] }[]
  ) {
    return this.productsService.updateQuantityProducts(data)
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
