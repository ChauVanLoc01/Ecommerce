import { PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateDeliveryDTO } from './create_delivery.dto'

export class UpdateDeliveryDTO extends PartialType(CreateDeliveryDTO) {
  @IsString()
  @IsNotEmpty()
  id: string
}
