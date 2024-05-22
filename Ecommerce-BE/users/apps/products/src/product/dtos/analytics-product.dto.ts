import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator'

export class AnalyticsProductDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  @IsNotEmpty()
  dates: string[]
}
