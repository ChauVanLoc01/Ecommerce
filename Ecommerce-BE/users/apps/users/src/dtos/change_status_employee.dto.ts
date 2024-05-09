import { IsEnum, IsNotEmpty } from 'class-validator'
import { Status } from 'common/enums/status.enum'

export class ChangeStatusEmployee {
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status
}
