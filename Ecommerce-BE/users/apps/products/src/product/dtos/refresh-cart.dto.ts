import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class RefreshCartDTO {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    productsId: string[]

    @IsString()
    @IsOptional()
    saleId?: string
}
