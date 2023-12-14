import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../../apps/users/src/auths/auth.service'
import { CurrentStoreType } from 'common/types/current.type'

@Injectable()
export class StoreStrategy extends PassportStrategy(Strategy, 'store') {
  constructor(private authenService: AuthService) {
    super()
  }

  async validate(
    username: string,
    password: string
  ): Promise<CurrentStoreType> {
    return await this.authenService.validateStore(username, password)
  }
}
