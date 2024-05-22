import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsString } from 'class-validator'

export class AnalyticsOrderDTO {
  @ApiProperty()
  @IsString({ each: true })
  dates: string[]
}
