import { ApiPropertyOptional } from "@nestjs/swagger";
import { PaginationDTO } from "common/decorators/pagination.dto";

export class QueryAllUserProfileDTO extends PaginationDTO {
}

export type QueryAllUserProfileType = InstanceType<typeof QueryAllUserProfileDTO>