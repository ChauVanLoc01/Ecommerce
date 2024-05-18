import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString } from 'class-validator'

export class AnalyticsOrderDTO {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  dates: Date[]
}
