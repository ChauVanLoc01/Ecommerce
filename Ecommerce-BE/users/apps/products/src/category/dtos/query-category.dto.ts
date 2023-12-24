import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmpty, IsString } from 'class-validator'

export class QueryCategoryDTO {
  @ApiPropertyOptional({
    description: 'Category Name'
  })
  @IsString()
  @IsEmpty()
  category_name: string
}

export type QueryCategoryType = InstanceType<typeof QueryCategoryDTO>
