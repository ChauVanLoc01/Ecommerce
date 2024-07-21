import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Store, User } from '@prisma/client'
import { CurrentStoreType } from 'common/types/current.type'
import { Strategy } from 'passport-local'
import { AuthService } from '../../apps/users/src/auths/auth.service'

@Injectable()
export class StoreStrategy extends PassportStrategy(Strategy, 'store') {
    constructor(private authenService: AuthService) {
        super()
    }

    async validate(
        username: string,
        password: string
    ): Promise<{ currentStoreType: CurrentStoreType; user: User; store?: Store }> {
        return await this.authenService.validateStore(username, password)
    }
}
