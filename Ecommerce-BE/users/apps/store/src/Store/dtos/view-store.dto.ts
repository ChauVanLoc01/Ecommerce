import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UserViewStoreDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    userId?: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    storeId: string
}
