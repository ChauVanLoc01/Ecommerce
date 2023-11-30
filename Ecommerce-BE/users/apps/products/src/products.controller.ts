import { Controller, Get, Inject } from '@nestjs/common'
import { ProductsService } from './products.service'
import { ClientProxy } from '@nestjs/microservices'
import { map } from 'rxjs'

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getHello() {
    return this.productsService.getHello()
  }
}
