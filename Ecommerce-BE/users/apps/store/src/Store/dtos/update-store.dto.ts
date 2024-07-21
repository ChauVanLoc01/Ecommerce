import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { CreateCategoryDTO } from 'apps/products/src/category/dtos/create-category.dto'
import { CreateStoreDTO } from './create-store.dto'
import { IsOptional, IsString } from 'class-validator'

export class UpdateStoreDTO extends PartialType(CreateStoreDTO) {}

export class UpdateStatusOfStoreDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    status?: string
}
