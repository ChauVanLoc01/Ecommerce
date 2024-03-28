import { IsInt, IsNotEmpty, IsString } from 'class-validator'
import { CreateDeliveryDTO } from './create_delivery.dto'

export class UpdateDeliveryDTO extends CreateDeliveryDTO {
  @IsString()
  @IsNotEmpty()
  id: string
}
