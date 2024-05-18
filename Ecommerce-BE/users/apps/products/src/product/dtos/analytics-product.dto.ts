import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class AnalyticsProductDTO {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  dates: Date[]
}
