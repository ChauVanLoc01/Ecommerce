import { Controller, Get, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { map } from 'rxjs'
import { ProductService } from './product.service'

@Controller()
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  getHello() {
    return this.productsService.getHello()
  }
}
