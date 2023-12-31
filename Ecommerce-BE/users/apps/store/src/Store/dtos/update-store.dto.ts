import { ApiProperty, PartialType } from '@nestjs/swagger'
import { CreateCategoryDTO } from 'apps/products/src/category/dtos/create-category.dto'
import { CreateStoreDTO } from './create-store.dto'

export class UpdateStoreDTO extends PartialType(CreateStoreDTO) {}
