import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Status } from "common/enums/status.enum";

export class UpdateEmployee {
    @IsString()
    @IsNotEmpty()
    employeeId: string

    @IsEnum([Status.ACTIVE, Status.BLOCK])
    @IsNotEmpty()
    status: Status.ACTIVE | Status.BLOCK
}