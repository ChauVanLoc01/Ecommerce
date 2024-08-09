import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator'

export class CreateStoreDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @IsUrl()
    @IsNotEmpty()
    image: string

    @ApiPropertyOptional()
    @IsString()
    location: string

    @ApiPropertyOptional()
    @IsString()
    tax: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string
}

export type CreateStoreType = InstanceType<typeof CreateStoreDTO>
