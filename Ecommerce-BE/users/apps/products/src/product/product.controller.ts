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
import { updateQuantityProducts } from 'common/constants/event.constant'
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

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productsService: ProductService,
    private searchProductService: SearchProductService
  ) {}

  @Public()
  @Get('es-search')
  searchProduct(@Query('search') search: string) {
    return this.productsService.searchProduct(search)
  }

  @Public()
  @Get()
  getAll(@Query() query: QueryProductDTO) {
    return this.productsService.getALlProduct(query)
  }

  @Public()
  @Get(':productId')
  getProductDetail(@Param('productId') productId: string) {
    return this.productsService.getProductDetail(productId)
  }

  @UseInterceptors(FileInterceptor('image'))
  @Roles(Role.EMPLOYEE, Role.STORE_OWNER)
  @Post()
  createProduct(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: 'image/*' })
        ],
        exceptionFactory(_) {
          throw new BadRequestException(
            'File tải lên phải có kiểu image/* và dung lượng maxmimum 5MB'
          )
        }
      })
    )
    file: Express.Multer.File,
    @CurrentUser() user: CurrentStoreType,
    @Body() body: CreateProductDTO
  ) {
    return this.productsService.createProduct(user, file.filename, body)
  }

  @UseInterceptors(FileInterceptor('image'))
  @Roles(Role.EMPLOYEE, Role.STORE_OWNER)
  @Put(':productId')
  updateProduct(
    @Param('productId') productId: string,
    @CurrentUser() user: CurrentStoreType,
    @Body() body: UpdateProductDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*' }),
          new MaxFileSizeValidator({ maxSize: 5000000 })
        ],
        exceptionFactory(_) {
          throw new BadRequestException(
            'File tải lên phải có kiểu image/* và dung lượng maxmimum 5MB'
          )
        }
      })
    )
    file?: Express.Multer.File
  ) {
    return this.productsService.updateProduct(user, productId, body, file.filename)
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
}
