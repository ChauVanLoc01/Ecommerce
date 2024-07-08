import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator'

export class RefundMaterialDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    url: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    type: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string
}

export class ProductOrderRefundDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productOrderId: string

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    quantity: number

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string
}

export class CreateOrderRefundDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductOrderRefundDTO)
    productOrders: ProductOrderRefundDTO[]

    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RefundMaterialDTO)
    materials: RefundMaterialDTO[]
}

export class UpdateOrderRefundDTO extends PartialType(CreateOrderRefundDTO) {}

export class CloseOrderRefundDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    note?: string
}

export class ReOpenOrderRefundDTO extends PickType(CreateOrderRefundDTO, [
    'description',
    'title',
    'materials'
]) {}

export class UpdateStatusOrderFlow {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    status: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    note?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    orderRefundId?: string
}
