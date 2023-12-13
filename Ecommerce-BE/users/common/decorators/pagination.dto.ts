import { ApiPropertyOptional } from "@nestjs/swagger"
import { Transform } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class PaginationDTO {
  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  page?: number;
}

export type PaginationType = InstanceType<typeof PaginationDTO>