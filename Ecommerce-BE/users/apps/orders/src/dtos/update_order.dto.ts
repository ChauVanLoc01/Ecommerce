import { ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { OrderStatus } from 'common/enums/orderStatus.enum'
import { TransactionEnum } from 'common/enums/transaction.enum'

export class UpdateOrderDTO {
  @ApiPropertyOptional({
    enum: OrderStatus
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus

  @ApiPropertyOptional({
    enum: TransactionEnum
  })
  @IsEnum(TransactionEnum)
  @IsOptional()
  transaction?: TransactionEnum

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string
}

export type UpdateOrderType = InstanceType<typeof UpdateOrderDTO>

export class UpdateStatusOrderDTO extends PickType(UpdateOrderDTO, ['status']) {}
