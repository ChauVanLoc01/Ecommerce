/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types'

// Custom
// DTOs
import { CreateCategoryDTO } from './create-category.dto'


export class UpdateCategoryDto extends PartialType(CreateCategoryDTO) {}