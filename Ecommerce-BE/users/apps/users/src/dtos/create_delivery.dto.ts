import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateDeliveryDTO {
  @IsString()
  @IsNotEmpty()
  full_name: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsString()
  @IsNotEmpty()
  address: string

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean
}
