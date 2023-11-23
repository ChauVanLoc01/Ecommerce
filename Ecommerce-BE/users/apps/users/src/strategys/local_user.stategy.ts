import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { AuthService } from '../auths/auth.service'

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy) {
  constructor(private authenService: AuthService) {
    super()
  }

  async validate(username: string, password: string): Promise<any> {
    const { id, role } = await this.authenService.validateUser(
      username,
      password
    )
    return { id, role }
  }
}
