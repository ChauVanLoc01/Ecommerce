import { SetMetadata } from '@nestjs/common'
import { Role } from 'common/enums/role.enum'

export const PUBLIC_KEY = 'public'
export const Public = () => SetMetadata(PUBLIC_KEY, true)
