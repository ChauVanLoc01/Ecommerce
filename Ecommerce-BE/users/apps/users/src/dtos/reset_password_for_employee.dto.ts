import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordForEmployee {
    @IsString()
    @IsNotEmpty()
    employeeId: string

    @IsString()
    @IsNotEmpty()
    username: string

    @IsString()
    @IsNotEmpty()
    password: string
}