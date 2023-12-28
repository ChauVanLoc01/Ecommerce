import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, JwtService]
})
export class CategoryModule {}
