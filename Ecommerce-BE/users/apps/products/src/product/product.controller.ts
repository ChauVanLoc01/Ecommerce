import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  createProductOrder,
  getAllProductWithProductOrder,
  updateQuantityProducts
} from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType } from 'common/types/current.type'
import { CreateProductDTO } from './dtos/create-product.dto'
import { QueryProductDTO } from './dtos/query-product.dto'
import { UpdateProductDTO } from './dtos/update-product.dto'
import { ProductService } from './product.service'
import { SearchProductService } from './search-product.service'
import { ApiBearerAuth, ApiProperty } from '@nestjs/swagger'

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
}
